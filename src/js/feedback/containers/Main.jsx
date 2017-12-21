import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { revealForm, setFormValues, sendFeedback, clearError } from '../actions';
import DefaultView from '../components/DefaultView';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackSubmitted from '../components/FeedbackSubmitted';

function Main(props) {
  let content = null;

  if (props.feedbackReceived) {
    content = <FeedbackSubmitted shouldSendResponse={props.formValues.shouldSendResponse}/>;
  } else {
    content = (
      <div>
        <DefaultView {...props}/>
        <FeedbackForm {...props}/>
      </div>
    );
  }

  return (
    <div className="feedback-widget">
      <div className="row">{content}</div>
    </div>
  );
}

const mapStateToProps = (state) => state.feedback;

const mapDispatchToProps = {
  setFormValues,
  revealForm,
  sendFeedback,
  clearError
};

Main.propTypes = {
  formValues: PropTypes.object.isRequired,
  formErrors: PropTypes.object.isRequired,
  formIsSubmittable: PropTypes.bool,
  requestPending: PropTypes.bool,
  feedbackReceived: PropTypes.bool,
  shouldSendResponse: PropTypes.bool,
  setFormValues: PropTypes.func.isRequired,
  revealForm: PropTypes.func.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

export { Main };
