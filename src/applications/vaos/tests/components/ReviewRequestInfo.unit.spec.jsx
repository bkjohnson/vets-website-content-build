import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ReviewRequestInfo from '../../components/review/ReviewRequestInfo';
import PreferredDates from '../../components/review/PreferredDates';

const defaultData = {
  phoneNumber: '5035551234',
  bestTimeToCall: {
    morning: true,
    afternoon: true,
  },
  email: 'joeblow@gmail.com',
  visitType: 'office',
  reasonForAppointment: 'routine-follow-up',
  reasonAdditionalInfo: 'additional information',
  calendarData: {
    selectedDates: [
      {
        date: '2019-11-25',
        optionTime: 'AM',
      },
      {
        date: '2019-11-26',
        optionTime: 'AM',
      },
      {
        date: '2019-11-27',
        optionTime: 'AM',
      },
    ],
  },
  facilityType: 'vamc',
  typeOfCareId: '323',
};

const facility = {
  institution: {
    institutionCode: '983GB',
    name: 'CHYSHR-Sidney VA Clinic',
    city: 'Sidney',
    stateAbbrev: 'NE',
    authoritativeName: 'CHYSHR-Sidney VA Clinic',
    rootStationCode: '983',
    adminParent: false,
    parentStationCode: '983',
  },
  institutionTimezone: 'America/Denver',
};

describe('VAOS <ReviewRequestInfo>', () => {
  describe('VA Request', () => {
    const data = { ...defaultData };
    const tree = mount(<ReviewRequestInfo data={data} facility={facility} />);
    const text = tree.text();

    // console.log(tree.debug());
    it('should render VA request section', () => {
      expect(text).to.contain('VA appointment');
    });

    it('should render type of care section', () => {
      expect(text).to.contain('Primary care');
    });

    it('should render addional information section', () => {
      expect(text).to.contain('additional information');
    });

    it('should render preferred date and time section', () => {
      expect(text).to.contain('November 25, 2019 in the morning');
    });

    it('should render contact details section', () => {
      expect(text).to.contain(
        'joeblow@gmail.com5035551234Call morning or afternoon',
      );
    });

    tree.unmount();
  });

  describe('CC Request', () => {
    const data = {
      ...defaultData,
      facilityType: 'communityCare',
      hasCommunityCareProvider: true,
      communityCareProvider: {
        practiceName: 'Practice name',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '5555555555',
        address: {
          street: '123 Test',
          street2: 'line 2',
          city: 'Northampton',
          state: 'MA',
          postalCode: '01060',
        },
      },
    };
    let tree;
    let text;

    beforeEach(() => {
      tree = mount(<ReviewRequestInfo data={data} facility={facility} />);
      text = tree.text();
    });

    afterEach(() => {
      tree.unmount();
    });

    it('should render CC request section', () => {
      expect(text).to.contain('Community care appointment');
    });

    it('should render type of care section', () => {
      expect(text).to.contain('Primary care');
    });

    describe('Preferred provider section', () => {
      it('should render provider information', () => {
        expect(text).to.contain('Practice name');
      });
    });

    it('should render additional information section', () => {
      expect(text).to.contain('additional information');
    });

    it('should render preferred date section', () => {
      expect(text).to.contain('November 25, 2019 in the morning');
    });

    it('should render multiple preferred dates', () => {
      expect(tree.find(PreferredDates).find('li')).to.have.lengthOf(3);
    });

    it('should render contact details section', () => {
      expect(text).to.contain(
        'joeblow@gmail.com5035551234Call morning or afternoon',
      );
    });
  });
});