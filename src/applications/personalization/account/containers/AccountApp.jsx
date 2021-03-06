import React from 'react';
import { connect } from 'react-redux';
import backendServices from 'platform/user/profile/constants/backendServices';
import { selectUser, isLOA3 } from 'platform/user/selectors';

import AccountMain from '../components/AccountMain';
import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import { fetchMHVAccount } from 'platform/user/profile/actions';

function AccountApp(props) {
  return (
    <div>
      <RequiredLoginView
        serviceRequired={backendServices.USER_PROFILE}
        user={props.user}
      >
        <DowntimeNotification
          appTitle="user account page"
          dependencies={[externalServices.mvi, externalServices.emis]}
        >
          <div className="row user-profile-row">
            <div className="usa-width-two-thirds medium-8 small-12 columns">
              <h1>Your VA.gov account settings</h1>
              <div className="va-introtext">
                <p>
                  Below, you’ll find your current settings for signing in to{' '}
                  VA.gov. Find out how to update your settings as needed to
                  access more site tools or add extra security to your account.
                </p>
              </div>
              <AccountMain
                login={props.login}
                profile={props.profile}
                fetchMHVAccount={props.fetchMHVAccount}
              />
            </div>
          </div>
        </DowntimeNotification>
      </RequiredLoginView>
    </div>
  );
}

const mapStateToProps = state => {
  const userState = selectUser(state);
  return {
    isLOA3: isLOA3(state),
    login: userState.login,
    profile: userState.profile,
    user: userState,
  };
};

const mapDispatchToProps = {
  fetchMHVAccount,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountApp);
export { AccountApp };
