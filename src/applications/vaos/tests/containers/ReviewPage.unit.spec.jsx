import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FLOW_TYPES, FETCH_STATUS } from '../../utils/constants';

import { ReviewPage } from '../../containers/ReviewPage';

describe('VAOS <ReviewPage>', () => {
  it('should render direct schedule view', () => {
    const flowType = FLOW_TYPES.DIRECT;
    const data = {};

    const tree = shallow(<ReviewPage flowType={flowType} data={data} />);

    expect(tree.find('ReviewDirectScheduleInfo').exists()).to.be.true;
    expect(
      tree
        .find('LoadingButton')
        .children()
        .text(),
    ).to.equal('Confirm appointment');

    tree.unmount();
  });

  it('should render review view', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(<ReviewPage flowType={flowType} data={data} />);

    expect(tree.find('ReviewRequestInfo').exists()).to.be.true;
    expect(
      tree
        .find('LoadingButton')
        .children()
        .text(),
    ).to.equal('Request appointment');

    tree.unmount();
  });

  it('should render submit loading state', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.loading}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('LoadingButton').props().isLoading).to.be.true;

    tree.unmount();
  });

  it('should render submit error state', () => {
    const flowType = FLOW_TYPES.REQUEST;
    const data = {};

    const tree = shallow(
      <ReviewPage
        submitStatus={FETCH_STATUS.failed}
        flowType={flowType}
        data={data}
      />,
    );

    expect(tree.find('LoadingButton').props().isLoading).to.be.false;
    expect(tree.find('AlertBox').props().status).to.equal('error');

    tree.unmount();
  });
});