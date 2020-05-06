const { getUserChats, getInitialUserChat } = require('../../mockData/chats');

function handleLoadChat({ socket, userID }, { chatID }) {
  const userChats = getUserChats(userID);
  const chat = userChats.find(x => x.id === chatID);
  if (chat) {
    socket.emit('loadChats', {
      chats: [getInitialUserChat(chat)],
    });
  }
}

module.exports = handleLoadChat;
