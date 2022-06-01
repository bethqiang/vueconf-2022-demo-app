export function formatBreeds (breeds) {
  if (breeds.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}

export function isEmptyObject (object) {
  return object && object.constructor === Object && Object.keys(object).length === 0;
}
