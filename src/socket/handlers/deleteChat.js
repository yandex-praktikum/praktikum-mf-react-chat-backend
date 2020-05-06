const { deletePrivateChat } = require('../../mockData/chats');

function handleDeleteChat({ socket, userID }, { chatID }) {
  deletePrivateChat(
    chatID,
    userID,
    () => socket.emit('deleteChat', { chatID }),
    () => socket.emit('serverError', { message: `A private chat with id ${chatID} does not exist.` })
  );
}

module.exports = handleDeleteChat;
