import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { selectCurrentlyOpenEditModal } from '../selectors';
import {
  openModal,
  createTransaction,
  updateSelectedAddress,
  updateValidationKeyAndSave,
  closeModal as closeAddressValidationModal,
  resetAddressValidation as resetAddressValidationAction,
} from '../actions';
import { getValidationMessageKey } from '../../utilities';
import {
  ADDRESS_VALIDATION_MESSAGES,
  CONFIRMED,
} from '../../constants/addressValidationMessages';

import * as VET360 from '../constants';

class AddressValidationModal extends React.Component {
  onChangeHandler = (address, selectedAddressId) => _event => {
    this.props.updateSelectedAddress(address, selectedAddressId);
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      validationKey,
      addressValidationType,
      selectedAddress,
      selectedAddressId,
    } = this.props;

    const payload = {
      ...selectedAddress,
      validationKey,
    };

    const method = payload.id ? 'PUT' : 'POST';

    if (selectedAddressId !== 'userEntered') {
      this.props.updateValidationKeyAndSave(
        VET360.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        this.props.analyticsSectionName,
      );
    } else {
      this.props.createTransaction(
        VET360.API_ROUTES.ADDRESSES,
        method,
        addressValidationType,
        payload,
        this.props.analyticsSectionName,
      );
    }
  };

  renderPrimaryButton = () => {
    const {
      addressValidationError,
      addressValidationType,
      validationKey,
      isLoading,
      addressFromUser,
      selectedAddressId,
    } = this.props;

    const disableButton = selectedAddressId === null;

    if (addressValidationError && !validationKey) {
      return (
        <button
          className="usa-button-primary"
          onClick={() =>
            this.props.openModal(addressValidationType, addressFromUser)
          }
        >
          Edit Address
        </button>
      );
    }

    return (
      <LoadingButton
        disabled={disableButton}
        isLoading={isLoading}
        className="usa-button-primary"
      >
        Update
      </LoadingButton>
    );
  };

  renderAddressOption = (address, id = 'userEntered') => {
    const {
      validationKey,
      addressValidationError,
      addressValidationType,
      addressFromUser,
      selectedAddressId,
    } = this.props;
    const {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      stateCode,
      zipCode,
    } = address;

    const isAddressFromUser = id === 'userEntered';
    const showEditLinkErrorState = addressValidationError && validationKey;
    const showEditLinkNonErrorState = !addressValidationError;
    const showEditLink = showEditLinkErrorState || showEditLinkNonErrorState;
    const isFirstOptionOrEnabled =
      (isAddressFromUser && validationKey) || !isAddressFromUser;

    return (
      <div
        key={id}
        className={
          isFirstOptionOrEnabled
            ? 'vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--center'
            : 'vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--center vads-u-margin-left--2 vads-u-margin-bottom--1p5'
        }
      >
        {isFirstOptionOrEnabled && (
          <input
            type="radio"
            name={id}
            disabled={isAddressFromUser && !validationKey}
            onChange={
              isFirstOptionOrEnabled && this.onChangeHandler(address, id)
            }
            checked={selectedAddressId === id}
          />
        )}
        <label
          htmlFor={id}
          className="vads-u-margin-top--2 vads-u-display--flex vads-u-align-items--center"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            {addressLine1 && <span>{addressLine1}</span>}
            {addressLine2 && <span>{` ${addressLine2}`}</span>}
            {addressLine3 && <span>{` ${addressLine3}`}</span>}
            {city &&
              stateCode &&
              zipCode && <span>{` ${city}, ${stateCode} ${zipCode}`}</span>}
            {isAddressFromUser &&
              showEditLink && (
                <a
                  onClick={() =>
                    this.props.openModal(addressValidationType, addressFromUser)
                  }
                >
                  Edit Address
                </a>
              )}
          </div>
        </label>
      </div>
    );
  };

  render() {
    const {
      isAddressValidationModalVisible,
      addressValidationType,
      suggestedAddresses,
      addressFromUser,
      validationKey,
      addressValidationError,
      closeModal,
      resetAddressValidation,
    } = this.props;

    const resetDataAndCloseModal = () => {
      resetAddressValidation();
      closeModal();
    };

    const confirmedSuggestions = suggestedAddresses.filter(
      suggestion =>
        suggestion.addressMetaData?.deliveryPointValidation === CONFIRMED,
    );

    const validationMessageKey = getValidationMessageKey(
      suggestedAddresses,
      validationKey,
      addressValidationError,
    );

    const addressValidationMessage =
      ADDRESS_VALIDATION_MESSAGES[validationMessageKey];

    const shouldShowSuggestions = confirmedSuggestions.length > 0;

    return (
      <Modal
        title={
          addressValidationType.includes('mailing')
            ? 'Edit mailing address'
            : 'Edit home address'
        }
        id="address-validation-warning"
        onClose={resetDataAndCloseModal}
        visible={isAddressValidationModalVisible}
      >
        <AlertBox
          className="vads-u-margin-bottom--1"
          status="warning"
          headline={addressValidationMessage.headline}
        >
          <p>{addressValidationMessage.modalText}</p>
        </AlertBox>
        <form onSubmit={this.onSubmit}>
          <span className="vads-u-font-weight--bold">You entered:</span>
          {this.renderAddressOption(addressFromUser)}
          {shouldShowSuggestions && (
            <span className="vads-u-font-weight--bold">
              Suggested Addresses:
            </span>
          )}
          {shouldShowSuggestions &&
            confirmedSuggestions.map((address, index) =>
              this.renderAddressOption(address, String(index)),
            )}
          {this.renderPrimaryButton()}
          <button
            type="button"
            className="usa-button-secondary"
            onClick={resetDataAndCloseModal}
          >
            Cancel
          </button>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const addressValidationType =
    state.vet360.addressValidation.addressValidationType;

  return {
    analyticsSectionName: VET360.ANALYTICS_FIELD_MAP[addressValidationType],
    isLoading:
      state.vet360.fieldTransactionMap[addressValidationType]?.isPending,
    isAddressValidationModalVisible:
      selectCurrentlyOpenEditModal(state) === 'addressValidation',
    addressValidationError:
      state.vet360.addressValidation.addressValidationError,
    suggestedAddresses: state.vet360.addressValidation.suggestedAddresses,
    addressValidationType,
    validationKey: state.vet360.addressValidation.validationKey,
    addressFromUser: state.vet360.addressValidation.addressFromUser,
    selectedAddress: state.vet360.addressValidation.selectedAddress,
    selectedAddressId: state.vet360.addressValidation.selectedAddressId,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      closeModal: closeAddressValidationModal,
      openModal,
      updateSelectedAddress,
      updateValidationKeyAndSave,
      createTransaction,
      resetAddressValidation: resetAddressValidationAction,
    },
    dispatch,
  ),
});

AddressValidationModal.propTypes = {
  analyticsSectionName: PropTypes.string,
  isAddressValidationModalVisible: PropTypes.bool.isRequired,
  addressValidationError: PropTypes.bool.isRequired,
  suggestedAddresses: PropTypes.array.isRequired,
  addressValidationType: PropTypes.string.isRequired,
  validationKey: PropTypes.number,
  addressFromUser: PropTypes.object.isRequired,
  selectedAddress: PropTypes.object.isRequired,
  selectedAddressId: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  createTransaction: PropTypes.func.isRequired,
  updateSelectedAddress: PropTypes.func.isRequired,
  updateValidationKeyAndSave: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddressValidationModal);
