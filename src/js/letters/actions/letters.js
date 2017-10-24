import Raven from 'raven-js';

import { apiRequest } from '../utils/helpers.jsx';
import {
  ADDRESS_TYPES,
  BACKEND_AUTHENTICATION_ERROR,
  BACKEND_SERVICE_ERROR,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_FAILURE,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_FAILURE,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTERS_FAILURE,
  GET_LETTERS_SUCCESS,
  LETTER_ELIGIBILITY_ERROR,
  LETTER_TYPES,
  UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_FAILURE,
  SAVE_ADDRESS_SUCCESS
} from '../utils/constants';

export function getLetterList() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters',
      null,
      response => dispatch({
        type: GET_LETTERS_SUCCESS,
        data: response,
      }),
      (response) => {
        const error = response.errors.length > 0 ? response.errors[0] : undefined;
        if (error) {
          if (error.status === '503' || error.status === '504') {
            // Either EVSS or a partner service is down or EVSS times out
            return dispatch({ type: BACKEND_SERVICE_ERROR });
          }
          if (error.status === '403') {
            // Backend authentication problem
            return dispatch({ type: BACKEND_AUTHENTICATION_ERROR });
          }
          if (error.status === '502') {
            // Some of the partner services are down, so we cannot verify the eligibility
            // of some letters
            return dispatch({ type: LETTER_ELIGIBILITY_ERROR });
          }
          return Promise.reject(
            new Error(`vets_letters_error_server_get: error status ${error.status}`)
          );
        }
        return Promise.reject(
          new Error('vets_letters_error_server_get: unknown error status')
        );
      }
    ).catch((error) => {
      if (error.message.match('vets_letters_error_server_get')) {
        Raven.captureException(error);
        return dispatch({ type: GET_LETTERS_FAILURE });
      }
      throw error;
    });
  };
}

export function getAddressFailure() {
  window.dataLayer.push({ event: 'letter-update-address-notfound' });
  return { type: GET_ADDRESS_FAILURE };
}

export function getMailingAddress() {
  return (dispatch) => {
    apiRequest(
      '/v0/address',
      null,
      response => {
        const responseCopy = Object.assign({}, response);
        const address = Object.assign({}, response.data.attributes.address);
        // Translate military-only fields into generic ones; we'll translate them back later if necessary
        if (address.type === ADDRESS_TYPES.military) {
          address.city = address.militaryPostOfficeTypeCode;
          address.stateCode = address.militaryStateCode;
          address.countryName = 'USA';
          delete address.militaryPostOfficeTypeCode;
          delete address.militaryStateCode;
        }
        responseCopy.data.attributes.address = address;

        dispatch({
          type: GET_ADDRESS_SUCCESS,
          data: responseCopy
        });
      },
      () => dispatch(getAddressFailure())
    );
  };
}

export function getBenefitSummaryOptions() {
  return (dispatch) => {
    apiRequest(
      '/v0/letters/beneficiary',
      null,
      response => dispatch({
        type: GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
        data: response,
      }),
      () => dispatch({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE })
    );
  };
}

export function getLetterPdf(letterType, letterName, letterOptions) {
  let settings;
  if (letterType === LETTER_TYPES.benefitSummary) {
    settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(letterOptions)
    };
  } else {
    settings = {
      method: 'POST'
    };
  }

  return (dispatch) => {
    dispatch({ type: GET_LETTER_PDF_DOWNLOADING, data: letterType });
    apiRequest(
      `/v0/letters/${letterType}`,
      settings,
      response => {
        let downloadUrl;
        response.blob().then(blob => {
          // We handle IE10 separately but assume all other vets.gov-supported
          // browsers have blob URL support.
          // TODO: possibly want to explicitly check for blob URL support with something like
          // const blobSupported = !!(/^blob:/.exec(downloadUrl));
          const ie10 = !!window.navigator.msSaveOrOpenBlob;
          const save = document.createElement('a');
          const downloadSupported = typeof save.download !== 'undefined';

          if (ie10) {
            window.navigator.msSaveOrOpenBlob(blob, `${letterName}.pdf`);
          } else {
            window.URL = window.URL || window.webkitURL;
            downloadUrl = window.URL.createObjectURL(blob);
            if (downloadSupported) {
              // Give the file a readable name if the download attribute is supported.
              save.download = letterName;
              save.href = downloadUrl;
              save.target = '_blank';
              document.body.appendChild(save);
              save.click();
              document.body.removeChild(save);
            } else {
              // Instead of giving the file a readable name and downloading
              // it directly, open it in a new window with an ugly hash URL
              const downloadWindow = window.open();
              downloadWindow.location.href = downloadUrl;
            }
          }
        });
        window.URL.revokeObjectURL(downloadUrl);
        dispatch({ type: GET_LETTER_PDF_SUCCESS, data: letterType });
      },
      () => dispatch({ type: GET_LETTER_PDF_FAILURE, data: letterType })
    );
  };
}

export function updateBenefitSummaryRequestOption(propertyPath, value) {
  return {
    type: UPDATE_BENFIT_SUMMARY_REQUEST_OPTION,
    propertyPath,
    value
  };
}

export function saveAddressPending() {
  return {
    type: SAVE_ADDRESS_PENDING
  };
}

export function saveAddressSuccess(address) {
  window.dataLayer.push({ event: 'letter-update-address-success' });
  return {
    type: SAVE_ADDRESS_SUCCESS,
    address
  };
}

export function saveAddressFailure() {
  window.dataLayer.push({ event: 'letter-update-address-failed' });
  return { type: SAVE_ADDRESS_FAILURE };
}

export function saveAddress(address) {
  const transformedAddress = Object.assign({}, address);
  if (transformedAddress.type === ADDRESS_TYPES.military) {
    transformedAddress.militaryPostOfficeTypeCode = transformedAddress.city;
    transformedAddress.militaryStateCode = transformedAddress.stateCode;
    delete transformedAddress.city;
    delete transformedAddress.stateCode;
    delete transformedAddress.countryName;
  }

  const settings = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transformedAddress)
  };
  window.dataLayer.push({ event: 'letter-update-address-submit' });
  return (dispatch) => {
    // TODO: Show a spinner or some kind of indication we're waiting on this to return
    dispatch(saveAddressPending());

    apiRequest(
      '/v0/address',
      settings,
      () => dispatch(saveAddressSuccess(address)),
      () => dispatch(saveAddressFailure())
    );
  };
}

export function getAddressCountries() {
  return (dispatch) => {
    apiRequest(
      '/v0/address/countries',
      null,
      response => dispatch({
        type: GET_ADDRESS_COUNTRIES_SUCCESS,
        countries: response,
      }),
      () => dispatch({ type: GET_ADDRESS_COUNTRIES_FAILURE })
    );
  };
}

export function getAddressStates() {
  return (dispatch) => {
    apiRequest(
      '/v0/address/states',
      null,
      response => dispatch({
        type: GET_ADDRESS_STATES_SUCCESS,
        states: response,
      }),
      () => dispatch({ type: GET_ADDRESS_STATES_FAILURE })
    );
  };
}
