import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  ADD_COMPOSE_ATTACHMENTS,
  DELETE_COMPOSE_ATTACHMENT,
  DELETE_COMPOSE_MESSAGE,
  RESET_MESSAGE_OBJECT,
  SET_MESSAGE_FIELD,
} from '../utils/constants';

const initialState = {
  message: {
    attachments: [],
    body: makeField(''),
    category: makeField(''),
    recipient: makeField(''),
    subject: makeField('')
  }
};

const resetMessage = (state) => {
  let msg = set('message.category', initialState.message.category, state);
  msg = set('message.recipient', initialState.message.recipient, msg);
  msg = set('message.subject', initialState.message.subject, msg);
  msg = set('message.attachments', initialState.message.attachments, msg);
  msg = set('message.body', initialState.message.body, msg);
  return msg;
};

export default function compose(state = initialState, action) {
  switch (action.type) {
    case ADD_COMPOSE_ATTACHMENTS:
      return set('message.attachments', [
        ...state.message.attachments,
        ...action.files
      ], state);
    case DELETE_COMPOSE_ATTACHMENT:
      // Remove the attachment at the requested index.
      state.message.attachments.splice(action.index, 1);
      return set('message.attachments', state.message.attachments, state);
    case DELETE_COMPOSE_MESSAGE:
      return initialState;
    case RESET_MESSAGE_OBJECT:
      return resetMessage(state);
    case SET_MESSAGE_FIELD:
      return set(action.path, action.field, state);
    default:
      return state;
  }
}
