function handleLeaveChat({ socket }, { chatID }) {
  socket.leave(chatID);
}

module.exports = handleLeaveChat;
