export function formatBreeds (breeds) {
  if (breeds.length) {
    const breedsArr = breeds.map(({ name }) => name);
    return breedsArr.join(', ');
  } else {
    return 'Unknown';
  }
}

export function hasVoted (vote) {
  if (vote === 1) {
    return 'Upvoted';
  } else if (vote === 0) {
    return 'Downvoted';
  } else {
    return 'Not Voted';
  }
}
