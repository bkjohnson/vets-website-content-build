import React from 'react';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const medicalDescription = (
  <div>
    <h4>Medical Care</h4>
    <p>
      Did you spend time in a hospital or under a doctor's care for your
      service-connected disabilties in the past 12 months?
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': medicalDescription,
  'view:medicalCare': {
    'ui:title': ' ',
    'ui:widget': 'yesNo',
  },
  unemployability: {
    underDoctorsCare: {
      'ui:title':
        'I‘ve been under a doctor‘s care in the past 12 months for these disabilities.',
    },
    hospitalized: {
      'ui:title':
        'I‘ve spent time in a hospital in the past 12 months for these disabilities.',
    },
    'ui:options': {
      expandUnder: 'view:medicalCare',
      expandUnderCondition: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:medicalCare': {
      type: 'boolean',
    },
    unemployability: {
      type: 'object',
      properties: {
        underDoctorsCare: {
          type: 'boolean',
        },
        hospitalized: {
          type: 'boolean',
        },
      },
    },
  },
};
