import React, { Component } from 'react';
import pluralize from 'pluralize';

import StatsBar from './StatsBar';

export default class AppointmentInfo extends Component {
  render() {
    const { facility } = this.props;

    if (!facility) {
      return null;
    }

    if (facility.attributes.facility_type !== 'va_health_facility') {
      return null;
    }

    const healthAccessAttrs = facility.attributes.access.health;

    return (
      <div className="mb2">
        <h4 className="highlight">Appointments</h4>
        <div className="mb2">
          <h4>New patient wait times</h4>
          <p>The average number of days a Veteran who hasn't been to this location has to wait for a non-urgent appointment</p>
          <ul>
            <li>Primary care: <strong>{pluralize('day', healthAccessAttrs.primary_care_wait_days.toFixed(0), true)}</strong></li>
            <li>Specialty care: <strong>{pluralize('day', healthAccessAttrs.specialty_care_wait_days.toFixed(0), true)}</strong></li>
            <li>Mental health care: <strong>{pluralize('day', healthAccessAttrs.mental_health_wait_days.toFixed(0), true)}</strong></li>
          </ul>
        </div>
        <div className="mb2">
          <h4>Timeliness of urgent appointments</h4>
          <p>
            % of Veterans who were referred to a specialist for urgent care and saw that specialist within 48 hours
          </p>
          <StatsBar percent={healthAccessAttrs.urgent_consult_percentage * 100} label="At this location"/>
          <StatsBar percent={70} label="National VA average" color="grey"/>
        </div>
      </div>
    );
  }
}
