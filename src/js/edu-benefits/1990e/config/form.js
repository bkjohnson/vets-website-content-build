import _ from 'lodash';

import {
  transform,
  eligibilityDescription
} from '../helpers';

import fullSchema1990e from 'vets-json-schema/dist/transfer-benefits-schema.json';

import contactInformation from '../../pages/contactInformation';
import directDeposit from '../../pages/directDeposit';
import createSchoolSelectionPage from '../../pages/schoolSelection';

import * as currentOrPastDate from '../../../common/schemaform/definitions/currentOrPastDate';
import * as fullNameCommon from '../../../common/schemaform/definitions/fullName';
import * as ssnCommon from '../../../common/schemaform/definitions/ssn';
import * as address from '../../../common/schemaform/definitions/address';

import IntroductionPage from '../components/IntroductionPage';
import ConfirmationPage from '../containers/ConfirmationPage';

import {
  benefitsLabels,
  relationshipLabels,
  genderLabels
} from '../../utils/helpers';

const {
  gender,
  relationship,
  fullName,
  ssn
} = fullSchema1990e.definitions;

const {
  benefit,
  serviceBranch,
  civilianBenefitsAssistance
} = fullSchema1990e.properties;

const {
  educationType,
  date
} = fullSchema1990e.definitions;

const formConfig = {
  urlPrefix: '/1990e/',
  submitUrl: '/v0/education_benefits_claims/1990e',
  trackingPrefix: 'edu-1990e-',
  transformForSubmit: transform,
  introduction: IntroductionPage,
  confirmation: ConfirmationPage,
  title: 'Apply for transferred education benefits',
  subTitle: 'Form 22-1990e',
  defaultDefinitions: {
    educationType,
    date
  },
  chapters: {
    applicantInformation: {
      title: 'Applicant Information',
      pages: {
        applicantInformation: {
          path: 'applicant-information',
          title: 'Applicant information',
          initialData: {},
          uiSchema: {
            relativeFullName: fullNameCommon.uiSchema,
            relativeSocialSecurityNumber: ssnCommon.uiSchema,
            relativeDateOfBirth: currentOrPastDate.uiSchema('Date of birth'),
            gender: {
              'ui:widget': 'radio',
              'ui:title': 'Gender',
              'ui:options': {
                labels: genderLabels
              }
            },
            relationship: {
              'ui:widget': 'radio',
              'ui:title': 'What is your relationship to the service member whose benefit is being transferred to you?',
              'ui:options': {
                labels: relationshipLabels
              }
            }
          },
          schema: {
            type: 'object',
            required: ['relativeFullName'],
            properties: {
              relativeFullName: fullNameCommon.schema,
              relativeSocialSecurityNumber: ssnCommon.schema,
              relativeDateOfBirth: currentOrPastDate.schema,
              gender,
              relationship
            }
          }
        }
      }
    },
    benefitEligibility: {
      title: 'Benefit Eligibility',
      pages: {
        benefitEligibility: {
          path: 'benefit-eligibility',
          title: 'Benefit Eligibility',
          uiSchema: {
            'view:benefitDescription': {
              'ui:description': eligibilityDescription
            },
            benefit: {
              'ui:widget': 'radio',
              'ui:title': 'Select the benefit that is the best match for you.',
              'ui:options': {
                labels: benefitsLabels
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              'view:benefitDescription': {
                type: 'object',
                properties: {}
              },
              benefit
            }
          },
        }
      }
    },
    sponsorVeteran: {
      title: 'Sponsor Veteran',
      pages: {
        sponsorVeteran: {
          title: 'Sponsor Veteran',
          path: 'sponsor-veteran',
          uiSchema: {
            sponsorVeteran: {
              veteranFullName: {
                first: {
                  'ui:title': 'Veteran first name'
                },
                last: {
                  'ui:title': 'Veteran last name'
                },
                middle: {
                  'ui:title': 'Veteran middle name'
                },
                suffix: {
                  'ui:title': 'Veteran suffix',
                  'ui:options': {
                    widgetClassNames: 'form-select-medium'
                  }
                }
              },
              veteranSocialSecurityNumber: _.set(ssnCommon.uiSchema, ['ui:title'], 'Veteran Social Security number'),
              veteranAddress: address.uiSchema('Veteran Address'),
              serviceBranch: {
                'ui:title': 'Branch of Service'
              },
              civilianBenefitsAssistance: {
                'ui:title': 'I am receiving benefits from the U.S. Government as a civilian employee during the same time as I am seeking benefits from VA.'
              }
            }
          },
          schema: {
            type: 'object',
            properties: {
              sponsorVeteran: {
                type: 'object',
                properties: {
                  veteranFullName: fullName,
                  veteranSocialSecurityNumber: ssn,
                  veteranAddress: address.schema(),
                  serviceBranch,
                  civilianBenefitsAssistance
                },
              }
            }
          }
        }
      }
    },
    educationHistory: {
      title: 'Education History',
      pages: {
      }
    },
    employmentHistory: {
      title: 'Employment History',
      pages: {
      }
    },
    schoolSelection: {
      title: 'School Selection',
      pages: {
        schoolSelection: createSchoolSelectionPage(fullSchema1990e, [
          'educationProgram',
          'educationObjective',
          'nonVaAssistance'
        ])
      }
    },
    personalInformation: {
      title: 'Personal Information',
      pages: {
        contactInformation,
        directDeposit
      }
    }
  }
};

export default formConfig;
