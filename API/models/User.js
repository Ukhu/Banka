export const users = [];

export const getUsersLength = () => users.length;

export const pushToDataStorage = (newUser) => {
  users.push(newUser);
};
