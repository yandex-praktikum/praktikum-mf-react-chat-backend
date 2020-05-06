const handleNewMessage = require('./newMessage');
const handleJoinChats = require('./joinChats');
const handleLeaveChat = require('./leaveChat');
const handleLoadChatMessages = require('./loadChatMessages');
const handleSearch = require('./search');
const handleCreateChat = require('./createChat');
const handleDeleteChat = require('./deleteChat');

function makeSocketMessageHandlerMaker(io, socket, userID) {
  return handler => payload => handler({ io, socket, userID }, payload);
}

module.exports = {
  makeSocketMessageHandlerMaker, handleNewMessage, handleJoinChats, handleLeaveChat,
  handleLoadChatMessages, handleSearch, handleCreateChat, handleDeleteChat,
};
