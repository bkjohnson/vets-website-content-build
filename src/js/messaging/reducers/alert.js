import React from 'react';
import { Link } from 'react-router';

import {
  DELETE_MESSAGE_FAILURE,
  DELETE_MESSAGE_SUCCESS,
  SAVE_DRAFT_FAILURE,
  SAVE_DRAFT_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS
} from '../actions/messages';

import {
  CLOSE_ALERT,
  OPEN_ALERT
} from '../actions/alert';

const alertStatus = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning'
};

const createAlert = (content, status, visible = true) => {
  return { content, status, visible };
};

const initialState = createAlert('', alertStatus.INFO, false);

export default function alert(state = initialState, action) {
  switch (action.type) {
    case CLOSE_ALERT:
      return createAlert('', alertStatus.INFO, false);

    case OPEN_ALERT:
      return createAlert(action.content, action.status);

    case DELETE_MESSAGE_FAILURE:
      return createAlert(
        <b>Failed to delete message.</b>,
        alertStatus.ERROR
      );

    case DELETE_MESSAGE_SUCCESS:
      return createAlert(
        <b>Your message has been deleted.</b>,
        alertStatus.SUCCESS
      );

    case SAVE_DRAFT_FAILURE:
      return createAlert(
        <b>Failed to save draft.</b>,
        alertStatus.ERROR
      );

    case SAVE_DRAFT_SUCCESS: {
      const id = action.data.data.attributes.messageId;
      const link = (
        <Link to={`/messaging/thread/${id}`}>
          View message.
        </Link>
      );

      return createAlert(
        <b>Your draft has been saved. {link}</b>,
        alertStatus.SUCCESS
      );
    }

    case SEND_MESSAGE_FAILURE:
      return createAlert(
        <b>Failed to send message.</b>,
        alertStatus.ERROR
      );

    case SEND_MESSAGE_SUCCESS: {
      const id = action.data.data.attributes.messageId;

      const link = (
        <Link to={`/messaging/thread/${id}`}>
          View message.
        </Link>
      );

      const content = (
        <b>
          Your message has been sent. {link} It can take
          up to 72 hours for a message to be seen and/or
          a response to be sent.
        </b>
      );

      return createAlert(content, alertStatus.SUCCESS);
    }

    default:
      return state;
  }
}
