// Dependencies.
import { orderBy } from 'lodash';
// Relative imports.
import mockForms from '../constants/example.json';
import { normalizeFormsForTable } from '../helpers';

// `fetchFormsApi` will need to be updated to make the request to api.va.gov once the endpoint is ready.
// fetch(`https://api.va.gov/find-va-forms?q=${query}`);
export const fetchFormsApi = async (URL, query) => {
  const filteredData = mockForms.data.filter(form =>
    form.attributes.title?.toLowerCase().includes(query),
  );

  const forms = {
    data: filteredData,
  };

  // Give back the normalized forms data.
  const normalizedForms = normalizeFormsForTable(forms);

  // Sort the forms by 'id' and 'asc' by default.
  const sortedForms = orderBy(normalizedForms, 'id', 'asc');

  return sortedForms;
};
