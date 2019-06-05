import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import appendQuery from 'append-query';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { fetchMHVAccount } from '../../../platform/user/profile/actions';

import recordEvent from '../../../platform/monitoring/record-event';
import { selectProfile } from '../../../platform/user/selectors';
import environment from '../../../platform/utilities/environment/index';
import { replaceWithStagingDomain } from '../../../platform/utilities/environment/stagingDomains';
import {
  ACCOUNT_STATES,
  ACCOUNT_STATES_SET,
  MHV_ACCOUNT_LEVELS,
  MHV_URL,
} from './../constants';

class ValidateMHVAccount extends React.Component {
  componentDidMount() {
    this.props.fetchMHVAccount();
  }

  componentDidUpdate(prevProps) {
    const { mhvAccount } = this.props;

    if (prevProps.mhvAccount.loading && !mhvAccount.loading) {
      this.redirect();
    }
  }

  redirect = () => {
    const { profile, mhvAccount, router } = this.props;
    const { accountLevel, accountState } = mhvAccount;
    const hyphenatedAccountState = accountState.replace(/_/g, '-');
    const gaPrefix = 'register-mhv-error';

    if (!profile.verified) {
      recordEvent({ event: `${gaPrefix}-needs-identity-verification` });
      router.replace('verify');
      return;
    }

    // MVI/MHV Checks
    if (this.props.mviDown) {
      recordEvent({ event: `${gaPrefix}-mvi-down` });
      router.replace('error/mvi-down');
      return;
    } else if (mhvAccount.errors) {
      recordEvent({ event: `${gaPrefix}-mhv-down` });
      router.replace('error/mhv-error');
      return;
    }

    // If valid account error state, record GA event
    if (ACCOUNT_STATES_SET.has(accountState)) {
      recordEvent({ event: `${gaPrefix}-${hyphenatedAccountState}` });
    }

    switch (accountState) {
      case ACCOUNT_STATES.NEEDS_VERIFICATION:
        router.replace('verify');
        return;
      case ACCOUNT_STATES.NEEDS_TERMS_ACCEPTANCE:
        this.redirectToTermsAndConditions();
        return;
      case ACCOUNT_STATES.DEACTIVATED_MHV_IDS:
      case ACCOUNT_STATES.MULTIPLE_IDS:
      case ACCOUNT_STATES.NEEDS_SSN_RESOLUTION:
      case ACCOUNT_STATES.REGISTER_FAILED:
      case ACCOUNT_STATES.UPGRADE_FAILED:
      case ACCOUNT_STATES.NEEDS_VA_PATIENT:
        router.replace(`error/${hyphenatedAccountState}`);
        return;
      default:
        break;
    }

    if (!accountLevel) {
      router.replace('create-account');
    } else if (
      accountLevel === MHV_ACCOUNT_LEVELS.PREMIUM ||
      accountLevel === MHV_ACCOUNT_LEVELS.ADVANCED
    ) {
      window.location = environment.isProduction()
        ? MHV_URL
        : replaceWithStagingDomain(MHV_URL);
    } else if (accountLevel === MHV_ACCOUNT_LEVELS.BASIC) {
      router.replace('upgrade-account');
    } else {
      router.replace('error');
    }
  };

  redirectToTermsAndConditions = () => {
    const redirectQuery = {
      tc_redirect: '/health-care/my-health-account-validation', // eslint-disable-line camelcase
    };
    const termsConditionsUrl = appendQuery(
      '/health-care/medical-information-terms-conditions/',
      redirectQuery,
    );
    window.location = termsConditionsUrl;
  };

  render() {
    return (
      <div className="row">
        <div className="vads-u-padding-bottom--5">
          <LoadingIndicator
            message="Loading your health information"
            setFocus
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const profile = selectProfile(state);
  const { mhvAccount, status } = profile;
  return {
    mhvAccount,
    mviDown: status === 'SERVER_ERROR',
    profile,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchMHVAccount },
  )(ValidateMHVAccount),
);
