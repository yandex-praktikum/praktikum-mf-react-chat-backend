const rickDalton = 'rick-dalton.jpg';
const shrek = 'shrek.jpg';

const users = [
  { id: 0, email: 'aa@aa.aa', password: "123", firstName: 'Rick', lastName: 'Dalton 1', nickname: 'rick_dalton', bio: 'The real human bean', imageURL: rickDalton },
  { id: 1, email: 'bb@bb.bb', password: "123", firstName: 'Rick', lastName: 'Dalton 2', nickname: 'real_rick_dalton', bio: 'The real human bean', imageURL: rickDalton },
  { id: 2, email: 'cc@cc.cc', password: "123", firstName: 'The', lastName: 'Shrek 1', nickname: 'shrek', bio: 'The real shrek', imageURL: shrek },
  { id: 3, email: 'dd@dd.dd', password: "123", firstName: 'The', lastName: 'Shrek 2', nickname: 'shrek2', bio: 'The real shrek', imageURL: shrek },
]

function getUsers() {
  return users;
}

function getUserByID(id) {
  return getUsers().find(x => x.id === id);
}

function getUsersForClient() {
  return users.map(convertUserForClient);
}

function convertUserForClient(user) {
  const { id, firstName, lastName, nickname, bio, imageURL } = user;
  return { id, firstName, lastName, nickname, bio, imageURL };
}

function addUser(user) {
  users.push(user);
}

module.exports = { getUsers, getUsersForClient, addUser, getUserByID, convertUserForClient };
