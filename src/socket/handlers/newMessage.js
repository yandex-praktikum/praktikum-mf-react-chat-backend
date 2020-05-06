const uuid = require('uuid');
const { isUserInChat, getChatByID } = require('../../mockData/chats');

// возможно брать срвереную дату? прочекать еще надо другие места
function handleNewMessage({ io, userID }, { message, chatID, date }) {
  if (isUserInChat(userID, chatID)) {
    const newMessage = { content: message, authorID: userID, date, id: uuid() };
    getChatByID(chatID).messages.unshift(newMessage);
    io.in(chatID).emit('newMessage', { message: newMessage, chatID });
  }
}

module.exports = handleNewMessage;
