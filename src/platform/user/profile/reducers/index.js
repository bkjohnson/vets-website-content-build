import { merge, set } from 'lodash/fp';

import { UPDATE_LOGGEDIN_STATUS } from '../../authentication/actions';
import { mapRawUserDataToState } from '../utilities';

import {
  UPDATE_PROFILE_FIELDS,
  PROFILE_LOADING_FINISHED,
  FETCHING_MHV_ACCOUNT,
  FETCH_MHV_ACCOUNT_FAILURE,
  FETCH_MHV_ACCOUNT_SUCCESS,
  CREATING_MHV_ACCOUNT,
  CREATE_MHV_ACCOUNT_FAILURE,
  CREATE_MHV_ACCOUNT_SUCCESS,
  UPGRADING_MHV_ACCOUNT,
  UPGRADE_MHV_ACCOUNT_FAILURE,
  UPGRADE_MHV_ACCOUNT_SUCCESS,
  REMOVING_SAVED_FORM_SUCCESS,
  UPDATE_VET360_PROFILE_FIELD,
} from '../actions';

const initialState = {
  userFullName: {
    first: null,
    middle: null,
    last: null,
    suffix: null,
  },
  email: null,
  dob: null,
  gender: null,
  accountType: null,
  loa: {
    current: null,
    highest: null
  },
  verified: false,
  mhvAccount: {
    accountLevel: null,
    accountState: null,
    errors: null,
    loading: false,
    termsAndConditionsAccepted: false
  },
  vet360: {},
  savedForms: [],
  prefillsAvailable: [],
  loading: true,
  services: []
};

function profileInformation(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE_FIELDS: {
      const newState = mapRawUserDataToState(action.payload);
      return merge(state, newState);
    }

    case UPDATE_VET360_PROFILE_FIELD:
      return set(
        ['vet360', action.fieldName],
        merge(state.vet360[action.fieldName], action.newValue),
        state,
      );

    case PROFILE_LOADING_FINISHED:
    case UPDATE_LOGGEDIN_STATUS:
      return set('loading', false, state);

    case FETCHING_MHV_ACCOUNT:
    case CREATING_MHV_ACCOUNT:
    case UPGRADING_MHV_ACCOUNT:
      return set('mhvAccount', {
        ...state.mhvAccount,
        loading: true
      }, state);

    case FETCH_MHV_ACCOUNT_FAILURE:
      return set('mhvAccount', {
        ...state.mhvAccount,
        errors: action.errors,
        loading: false
      }, state);

    case FETCH_MHV_ACCOUNT_SUCCESS: {
      const {
        accountState,
        accountLevel,
        termsAndConditionsAccepted
      } = action.data.attributes;

      return set('mhvAccount', {
        accountLevel,
        accountState,
        errors: null,
        loading: false,
        termsAndConditionsAccepted
      }, state);
    }

    case CREATE_MHV_ACCOUNT_FAILURE:
      return set('mhvAccount', {
        ...state.mhvAccount,
        accountState: 'register_failed',
        loading: false
      }, state);

    case UPGRADE_MHV_ACCOUNT_FAILURE:
      return set('mhvAccount', {
        ...state.mhvAccount,
        accountState: 'upgrade_failed',
        loading: false
      }, state);

    case CREATE_MHV_ACCOUNT_SUCCESS:
    case UPGRADE_MHV_ACCOUNT_SUCCESS: {
      const { accountLevel, accountState } = action.data.attributes;
      return set('mhvAccount', {
        ...state.mhvAccount,
        accountLevel,
        accountState,
        errors: null,
        loading: false
      }, state);
    }

    case REMOVING_SAVED_FORM_SUCCESS: {
      const forms = state.savedForms.filter(el => el.form !== action.formId);
      return set('savedForms', forms, state);
    }

    default:
      return state;
  }
}

export default profileInformation;
