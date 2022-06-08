import { render as VTLRender } from '@testing-library/vue';
import components from '@lob/ui-components';

export function render (Component, options = {}) {
  const { global = {}, ...otherOptions } = options;
  const { plugins = [], mocks = {}, ...otherGlobalOptions } = global;
  return VTLRender(Component, { global: { plugins: [components, ...plugins], mocks: { ...mocks }, ...otherGlobalOptions }, ...otherOptions });
}

export function formatBreeds (breeds) {
  if (breeds?.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}

export function isEmptyObject (object) {
  return object && object.constructor === Object && Object.keys(object).length === 0;
}
