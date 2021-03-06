import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import ArrayCountWidget from '../../../src/js/widgets/ArrayCountWidget';

describe('Schemaform <ArrayCountWidget>', () => {
  it('should render with the right count', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'array' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(tree.subTree('input').props.value).to.equal(2);
  });
  it('should render with the right count with offset', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'array' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{
          countOffset: -1,
        }}
      />,
    );
    expect(tree.subTree('input').props.value).to.equal(3);
  });
  it('should render 0 if array is empty', () => {
    const onChange = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayCountWidget
        id="1"
        value={[]}
        schema={{ type: 'array' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{}}
      />,
    );
    expect(tree.subTree('input').props.value).to.equal(0);
  });
  it('should handle change that adds items', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{}}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '3',
      },
    });
    expect(onChange.firstCall.args[0]).to.eql([{}, {}, {}]);
    tree.unmount();
  });
  it('should handle change that adds items with offset', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{
          countOffset: -1,
        }}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '3',
      },
    });
    expect(onChange.firstCall.args[0]).to.eql([{}, {}]);
    tree.unmount();
  });
  it('should handle change that removes items', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{}}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '1',
      },
    });
    expect(onChange.firstCall.args[0]).to.eql([{}]);
    tree.unmount();
  });
  it('should handle change that removes all items', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{}}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '',
      },
    });
    expect(onChange.firstCall.args[0]).to.equal(undefined);
    tree.unmount();
  });
  it('should handle change that removes with offset', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{
          countOffset: -2,
        }}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '1',
      },
    });
    expect(onChange.firstCall.args[0]).to.equal(undefined);
    tree.unmount();
  });
  it('should handle change that removes all offset', () => {
    const onChange = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        value={[{}, {}]}
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        options={{
          countOffset: -1,
        }}
      />,
    );
    tree.find('input').simulate('change', {
      target: {
        value: '1',
      },
    });
    expect(onChange.firstCall.args[0]).to.eql([]);
    tree.unmount();
  });
  it('should handle blur', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = SkinDeep.shallowRender(
      <ArrayCountWidget
        id="1"
        schema={{ type: 'string' }}
        required
        disabled={false}
        formContext={{}}
        onChange={onChange}
        onBlur={onBlur}
        options={{}}
      />,
    );
    tree.subTree('input').props.onBlur();
    expect(onBlur.calledWith('1')).to.be.true;
  });
  it('should handle review mode', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const tree = shallow(
      <ArrayCountWidget
        id="1"
        value={[{}]}
        schema={{ type: 'string' }}
        uiSchema={{ 'ui:title': 'Test title' }}
        required
        disabled={false}
        formContext={{ reviewMode: true }}
        onChange={onChange}
        onBlur={onBlur}
        options={{}}
      />,
    );
    expect(tree.find('dd').text()).to.contain('1');
    expect(tree.find('dt').text()).to.contain('Test title');
    tree.unmount();
  });
});
