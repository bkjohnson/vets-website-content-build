import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  errorMessage,
  missingTotalMessage,
  totalRatingMessage,
} from './TotalRatingStates';

const TotalRatedDisabilities = props => {
  const { loading, totalDisabilityRating } = props;
  const status = props.error ? props.error.status : null;
  const serverErrorRegex = /^5\d{2}$/;
  const serviceErrorRegex = /^4\d{2}$/;
  let content;
  // If the data from the parent is loading ( loading prop ), show a loading indicator
  // If there is an error, display an error message,
  // If there is no rating, display a no rating message
  // If there is a rating, display the rating and content
  if (loading) {
    content = (
      <LoadingIndicator message="Loading your total disability rating..." />
    );
  } else if (status && serverErrorRegex.test(status)) {
    content = errorMessage();
  } else if (
    !totalDisabilityRating ||
    (status && serviceErrorRegex.test(status))
  ) {
    content = missingTotalMessage();
  } else {
    content = totalRatingMessage(totalDisabilityRating);
  }

  return <>{content}</>;
};

TotalRatedDisabilities.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  totalDisabilityRating: PropTypes.number,
};

export default TotalRatedDisabilities;
