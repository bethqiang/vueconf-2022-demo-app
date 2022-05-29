export function formatBreeds (breeds) {
  if (breeds.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}
