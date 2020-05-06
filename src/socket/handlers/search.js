const { getUserChats, getInitialUserChat, getUserPrivateChats, isUserInChat } = require('../../mockData/chats');
const { getUsersForClient } = require('../../mockData/users');

function isMatchingSearchString(value, searchValue) {
  return typeof value === 'string'
    ? value.toLowerCase().includes(searchValue.toLowerCase())
    : false;
}

// TODO: надо подумать насчет проверки типов от клиента, например searchValue.toLowerCase() может не быть
// темб олее что оно летит с клиента
function handleSearch({ socket, userID }, { searchValue }) {
  if (userID !== null) {
    if (searchValue === '') {
      socket.emit('search', {
        chats: [],
        users: [],
      });
    } else {
      const foundUsers = getUsersForClient().filter(user => {
        const matchingSearchString = isMatchingSearchString(user.nickname, searchValue);
        const isCurrentUser = user.id === userID;
        const existingChat = getUserPrivateChats(userID).find(chat => isUserInChat(user.id, chat.id));
        return matchingSearchString
          && !isCurrentUser
          && (!existingChat || existingChat && Boolean(existingChat.deletionItems.find(x => x.userID === userID && x.status === 'deleted')));
      });
      const foundChats = getUserChats(userID)
        .filter(c => isMatchingSearchString(c.name, searchValue)
          && (c.type === 'private' && !c.deletionItems.find(x => x.userID === userID && x.status === 'deleted'))
        ).map(getInitialUserChat);
      socket.emit('search', {
        users: foundUsers,
        chats: foundChats,
      });
    }
  }
}

module.exports = handleSearch;
