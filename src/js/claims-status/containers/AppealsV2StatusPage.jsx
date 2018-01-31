import React from 'react';
import PropTypes from 'prop-types';

import { getStatusContents, getNextEvents, EVENT_TYPES, CLOSED_STATUSES } from '../utils/appeals-v2-helpers';

import Timeline from '../components/appeals-v2/Timeline';
import CurrentStatus from '../components/appeals-v2/CurrentStatus';
import AlertsList from '../components/appeals-v2/AlertsList';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page
 */
const AppealsV2StatusPage = ({ appeal }) => {
  const { events, alerts, status, docket, incompleteHistory } = appeal.attributes;
  const { type, details } = status;
  const currentStatus = getStatusContents(type, details);

  // NB: 'details' doesn't do anything in getNextEvents for the time being
  const nextEvents = getNextEvents(type, details);

  // TODO: This will change. We'll be getting the date from the docket object in the api.
  const form9Event = events.find(e => e.type === EVENT_TYPES.form9, null);

  // Presumably we just won't even show the docket without this event, but that needs to be
  //  verified first. For now, we'll just make sure form9 event exists first.
  const form9Date = form9Event && form9Event.date;

  // Gates the What's Next and Docket chunks
  const appealIsClosed = CLOSED_STATUSES.includes(type);

  return (
    <div>
      <Timeline events={events} missingEvents={incompleteHistory}/>
      <CurrentStatus
        title={currentStatus.title}
        description={currentStatus.description}
        isClosed={appealIsClosed}/>
      <AlertsList alerts={alerts}/>
      {!appealIsClosed && <WhatsNext nextEvents={nextEvents}/>}
      {!appealIsClosed && <Docket {...docket} form9Date={form9Date}/>}
      {appealIsClosed && <div className="closed-appeal-notice">This appeal is now closed</div>}
    </div>
  );
};

AppealsV2StatusPage.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      events: PropTypes.array,
      alerts: PropTypes.array,
      status: PropTypes.shape({
        type: PropTypes.string,
        details: PropTypes.object,
      }).isRequired,
      docket: PropTypes.shape({
        total: PropTypes.number.isRequired,
        ahead: PropTypes.number.isRequired,
        eta: PropTypes.string.isRequired
      })
    }).isRequired,
  })
};

export default AppealsV2StatusPage;
