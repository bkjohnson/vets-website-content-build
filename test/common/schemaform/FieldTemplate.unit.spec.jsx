import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import FieldTemplate from '../../../src/js/common/schemaform/FieldTemplate';

describe('Schemaform <FieldTemplate>', () => {
  it('should render', () => {
    const schema = {
      type: 'string'
    };
    const uiSchema = {
      'ui:title': 'Title'
    };
    const formContext = {};
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
          id="test"
          schema={schema}
          uiSchema={uiSchema}
          rawErrors={errors}
          formContext={formContext}>
        <div className="field-child"/>
      </FieldTemplate>
    );

    expect(tree.subTree('label').text()).to.equal('Title');
    expect(tree.everySubTree('.field-child')).not.to.be.empty;
    expect(tree.everySubTree('.usa-input-error-message')).to.be.empty;
  });
  it('should render object', () => {
    const schema = {
      type: 'object'
    };
    const uiSchema = {
      'ui:title': 'Title'
    };
    const formContext = {};
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
          id="test"
          schema={schema}
          uiSchema={uiSchema}
          rawErrors={errors}
          formContext={formContext}>
        <div className="field-child"/>
      </FieldTemplate>
    );

    expect(tree.props.className).to.equal('field-child');
  });
  it('should render required', () => {
    const schema = {
      type: 'string'
    };
    const uiSchema = {
      'ui:title': 'Title'
    };
    const formContext = {};
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
          id="test"
          schema={schema}
          uiSchema={uiSchema}
          required
          formContext={formContext}>
        <div className="field-child"/>
      </FieldTemplate>
    );

    expect(tree.everySubTree('.schemaform-required-span')).not.to.be.empty;
  });
  it('should render error when touched', () => {
    const schema = {
      type: 'string'
    };
    const uiSchema = {
      'ui:title': 'Title'
    };
    const formContext = {};
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
          id="test"
          schema={schema}
          uiSchema={uiSchema}
          rawErrors={errors}
          touchedSchema
          formContext={formContext}>
        <div className="field-child"/>
      </FieldTemplate>
    );

    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Some error');
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
  });
  it('should render error when submitted', () => {
    const schema = {
      type: 'string'
    };
    const uiSchema = {
      'ui:title': 'Title'
    };
    const formContext = {
      submitted: true
    };
    const errors = ['Some error'];
    const tree = SkinDeep.shallowRender(
      <FieldTemplate
          id="test"
          schema={schema}
          uiSchema={uiSchema}
          rawErrors={errors}
          formContext={formContext}>
        <div className="field-child"/>
      </FieldTemplate>
    );

    expect(tree.subTree('.usa-input-error-message').text()).to.equal('Some error');
    expect(tree.everySubTree('.usa-input-error')).not.to.be.empty;
  });
});
