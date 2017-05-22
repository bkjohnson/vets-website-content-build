import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import HealthCareApp from '../../../src/js/hca/components/HealthCareApp';
import reducer from '../../../src/js/hca/reducers';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);

describe('<HealthCareApp>', () => {
  it('Sanity check the component renders', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<HealthCareApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
