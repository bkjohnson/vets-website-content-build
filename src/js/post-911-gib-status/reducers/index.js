import set from 'lodash/fp/set';

const initialState = {
  enrollmentData: null,
  available: false
};

export function post911GIBillStatus(state = initialState, action) {
  switch (action.type) {
    case 'GET_ENROLLMENT_DATA_SUCCESS':
      return {
        ...state,
        enrollmentData: action.data,
        available: true
      };
    case 'GET_ENROLLMENT_DATA_FAILURE':
      return set('avaiable', false, state);
    default:
      return state;
  }
}
