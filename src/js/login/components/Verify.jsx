import PropTypes from 'prop-types';
import React from 'react';

import { handleVerify } from '../../common/helpers/login-helpers.js';

class Verify extends React.Component {
  constructor(props) {
    super(props);

    this.handleVerify = this.handleVerify.bind(this);
  }

  componentDidMount() {
    window.dataLayer.push({ event: 'verify-prompt-displayed' });
  }

  componentWillReceiveProps(nextProps) {
    this.checkAccountAccess(nextProps.profile.accountType);
  }

  // TODO: fix this to depend on list of services
  checkAccountAccess(accountType) {
    if (accountType > 1) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');

      if (nextPath) {
        window.location.replace(nextPath || '/');
      } else {
        window.location.replace('/');
      }
    }
  }

  handleVerify() {
    handleVerify(this.props.verifyUrl);
  }

  render() {
    return (
      <main className="verify">
        <div className="row">
          <div className="columns">
            <div className="logo">
              <a href="/">
                <img alt="vets.gov" className="va-header-logo" src="/img/design/logo/logo-alt.png"/>
              </a>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <h1>Verify your identity</h1>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <p>
                We'll need to verify your identity so that you can securely access and manage your benefits.<br/>
                <a href="/faq#dbq2">Why does Vets.gov verify identity?</a>
              </p>
              <p>This one-time process will take <strong>5 - 10 minutes</strong> to complete.</p>
              <button className="usa-button-primary va-button-primary" onClick={this.handleVerify}>
                <img alt="ID.me" src="/img/signin/idme-icon-white.svg"/><strong> Verify with ID.me</strong>
              </button>
              <span className="sidelines">OR</span>

              <h4>Already using other VA online services?</h4>
              <p>If you have a <strong>premium account</strong> with My HealtheVet or DS Logon, you can use it to verify your identity automatically:</p>

              <button className="dslogon" onClick={this.handleVerify}>
                <img alt="ID.me" src="/img/signin/dslogon-icon.svg"/><strong> Verify with DS Logon</strong>
              </button>
              <span>(Used for eBenefits and milConnect)</span>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble verifying your identity?</h4>
                <p><a href="/faq">Get answers to Frequently Asked Questions</a></p>
                <p>
                  Call the Vets.gov Help Desk at <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008294833">1-800-829-4833</a>).<br/>
                  We're here Monday – Friday, 8:00am – 8:00pm (ET).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

Verify.propTypes = {
  verifyUrl: PropTypes.string,
  profile: PropTypes.object,
};

export default Verify;
