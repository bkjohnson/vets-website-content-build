import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

import { focusElement } from 'platform/utilities/ui';

import {
  getAccountNumberErrorMessage,
  getRoutingNumberErrorMessage,
  getAccountTypeErrorMessage,
} from '../util/paymentInformation';
import { ACCOUNT_TYPES_OPTIONS } from '../constants';

import PaymentInformationEditModalError from './PaymentInformationEditModalError';

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editModalFieldChanged: PropTypes.func.isRequired,
    responseError: PropTypes.object,
  };

  onSubmit = event => {
    event.preventDefault();

    const {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

    const routingNumberErr = getRoutingNumberErrorMessage(
      routingNumber.field.value,
    );
    const accountNumberErr = getAccountNumberErrorMessage(
      accountNumber.field.value,
    );
    const accountTypeErr = getAccountTypeErrorMessage(accountType.value.value);

    if (routingNumberErr) {
      focusElement('[name=routing-number]');
    } else if (accountNumberErr) {
      focusElement('[name=account-number]');
    } else if (accountTypeErr) {
      focusElement('[name=account-type]');
    } else {
      this.props.onSubmit({
        financialInstitutionName: 'Hidden form field',
        financialInstitutionRoutingNumber: routingNumber.field.value,
        accountNumber: accountNumber.field.value,
        accountType: accountType.value.value,
      });
    }
  };

  onRoutingNumberChanged = field => {
    this.props.editModalFieldChanged('financialInstitutionRoutingNumber', {
      field,
      errorMessage: field.dirty && getRoutingNumberErrorMessage(field.value),
    });
  };

  onAccountNumberChanged = field => {
    this.props.editModalFieldChanged('accountNumber', {
      field,
      errorMessage: field.dirty && getAccountNumberErrorMessage(field.value),
    });
  };

  onAccountTypeChanged = value => {
    this.props.editModalFieldChanged('accountType', {
      value,
      errorMessage: value.dirty && getAccountTypeErrorMessage(value.value),
    });
  };

  render() {
    const {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

    return (
      <Modal
        title="Edit your direct deposit information"
        visible={this.props.isEditing}
        onClose={this.props.onClose}
      >
        {!!this.props.responseError && (
          <PaymentInformationEditModalError
            responseError={this.props.responseError}
          />
        )}
        <p className="vads-u-margin-top--1p5">
          Please provide your bank’s current routing number as well as your
          current account number and type. Then click <strong>Update</strong> to
          save your information.
        </p>
        <img
          src="/img/direct-deposit-check-guide.png"
          alt="On a personal check, find your bank's 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />

        <form onSubmit={this.onSubmit}>
          <ErrorableTextInput
            label="Routing number (9 digits)"
            name="routing-number"
            field={routingNumber.field}
            errorMessage={routingNumber.errorMessage}
            onValueChange={this.onRoutingNumberChanged}
            required
            charMax={9}
          />

          <ErrorableTextInput
            label="Account number (No more than 17 digits)"
            name="account-number"
            field={accountNumber.field}
            errorMessage={accountNumber.errorMessage}
            onValueChange={this.onAccountNumberChanged}
            required
            charMax={17}
          />

          <ErrorableSelect
            label="Account type"
            name="account-type"
            value={accountType.value}
            errorMessage={accountType.errorMessage}
            onValueChange={this.onAccountTypeChanged}
            options={Object.values(ACCOUNT_TYPES_OPTIONS)}
            includeBlankOption
            required
          />

          <button
            type="submit"
            className="usa-button-primary vads-u-width--auto"
            disabled={this.props.isSaving}
          >
            Update
          </button>

          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.props.onClose}
          >
            Cancel
          </button>
        </form>
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;