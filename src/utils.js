export function formatBreeds (breeds) {
  if (breeds.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}

export function voted (include_vote) {
  if (include_vote === 1) {
    return 'Upvoted';
  } else if (include_vote === 0) {
    return 'Downvoted';
  } else {
    return 'Not Voted';
  }
}
