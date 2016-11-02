import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import ReactTestUtils from 'react-addons-test-utils';

import { TurnInEvidencePage } from '../../../src/js/disability-benefits/containers/TurnInEvidencePage';

describe('<TurnInEvidencePage>', () => {
  it('should render loading div', () => {
    const tree = SkinDeep.shallowRender(
      <TurnInEvidencePage
          loading/>
    );
    expect(tree.everySubTree('LoadingIndicator')).not.to.be.empty;
  });
  it('should render upload error alert', () => {
    const claim = {
      id: 1
    };
    const tree = SkinDeep.shallowRender(
      <TurnInEvidencePage
          claim={claim}
          uploadError/>
    );
    expect(tree.subTree('UploadError')).not.to.be.false;
  });
  it('should handle submit files', () => {
    const files = [];
    const claim = {
      id: 1
    };
    const onSubmit = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <TurnInEvidencePage
          claim={claim}
          files={files}
          submitFiles={onSubmit}/>
    );
    tree.subTree('AddFilesForm').props.onSubmit();
    expect(onSubmit.calledWith(1, null, files)).to.be.true;
  });
  it('should reset uploads and set title on mount', () => {
    const claim = {
      id: 1
    };
    const resetUploads = sinon.spy();
    ReactTestUtils.renderIntoDocument(
      <TurnInEvidencePage
          claim={claim}
          files={[]}
          uploadField={{ value: null, dirty: false }}
          resetUploads={resetUploads}/>
    );

    expect(document.title).to.equal('Turn in More Evidence');
    expect(resetUploads.called).to.be.true;
  });
  it('should set details and go to files page if complete', () => {
    const claim = {
      id: 1
    };
    const router = {
      push: sinon.spy()
    };
    const getClaimDetail = sinon.spy();
    const resetUploads = sinon.spy();

    const tree = SkinDeep.shallowRender(
      <TurnInEvidencePage
          claim={claim}
          files={[]}
          uploadComplete
          uploadField={{ value: null, dirty: false }}
          router={router}
          getClaimDetail={getClaimDetail}
          resetUploads={resetUploads}/>
    );

    tree.getMountedInstance().componentWillReceiveProps({ uploadComplete: true });
    expect(getClaimDetail.calledWith(1)).to.be.true;
    expect(router.push.calledWith('your-claims/1/files')).to.be.true;
  });
});

