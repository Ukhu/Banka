export const capitaliseFirstLetter = (value) => {
  if (value !== '') {
    const smallLetter = value.toLowerCase();

    const restLetters = smallLetter.slice(1);

    return `${smallLetter[0].toUpperCase()}${restLetters}`;
  }
  return ' ';
};

export const makeLowerCase = (value) => {
  if (value !== '') {
    return value.toLowerCase();
  }
  return ' ';
};
