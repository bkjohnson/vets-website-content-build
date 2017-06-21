import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';

class DownloadLetters extends React.Component {
  render() {
    const destination = this.props.destination || {};
    const letterItems = (this.props.letters || []).map((letter) => {
      return (
        <li key={letter.letterType}>
          <a href="#">{letter.letterName}</a>
        </li>
      );
    });
    return (
      <div>
        <FormTitle title="Download Your VA Verification Letters"/>
        <div className="va-introtext">
          <p>
            For some benefits, Veterans or surviving spouses and dependents need a letter from the VA proving Veteran or surviving status. This tool will allow you to get these letters online.
          </p>
        </div>
        <div className="letters-form-panel">
          <p>The address on file for you with VA Compensation and Pension is:</p>
          <span>{destination.fullName}</span><br/>
          <span>{destination.addressLine1}, {destination.addressLine2} {destination.addressLine3}</span><br/>
          <span>{destination.city}, {destination.state} {destination.zipCode}</span>
        </div>
        <div>
          <p>The following letters are available for download:</p>
          <ul>
            {letterItems}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  const letterState = state.letters;
  return {
    profile: userState.profile,
    letters: letterState.letters,
    destination: letterState.destination,
    available: letterState.available
  };
}

export default connect(mapStateToProps)(DownloadLetters);
