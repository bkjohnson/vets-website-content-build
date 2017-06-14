import React from 'react';

import FormApp from '../common/schemaform/FormApp';
import formConfig from './config/form';

export default function BurialsEntry({ location, children }) {
  return (
    <FormApp formConfig={formConfig} currentLocation={location}>
      {children}
    </FormApp>
  );
}
