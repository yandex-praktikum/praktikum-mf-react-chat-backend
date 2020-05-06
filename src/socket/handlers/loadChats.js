const { getUserChats, getInitialUserChat } = require('../../mockData/chats');

function handleLoadChats({ socket, userID }, { fromDate,  }) {
  const userChats = getUserChats(userID);
  const chat = userChats.find(x => x.id === chatID);
  if (chat) {
    socket.emit('loadChats', {
      chats: [getInitialUserChat(chat)],
    });
  }
}

module.exports = handleLoadChats;
