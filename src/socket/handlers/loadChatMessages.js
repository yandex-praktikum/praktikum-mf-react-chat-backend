const { getChatByID, isUserInChat } = require('../../mockData/chats');

function handleLoadChatMessages({ socket, userID }, { chatID, lastLoadedMessageID, messagesToLoad }) {
  const chat = getChatByID(chatID);
  if (chat && isUserInChat(userID, chatID)) {
    const lastLoadedMessageIndex = chat.messages.findIndex(x => x.id === lastLoadedMessageID);
    const fromIndex = lastLoadedMessageIndex + 1;
    const toIndex = fromIndex + messagesToLoad - 1;
    const deletionItem = chat.type === 'private'
      ? chat.deletionItems.find(x => x.userID === userID)
      : null;
    const messages = deletionItem
      ? chat.messages.filter(x => x.date >= deletionItem.date)
      : chat.messages;
    socket.emit('loadChatMessages', {
      messages: messages.slice(fromIndex, toIndex + 1).reverse(),
      chatID,
    });
  }
};

module.exports = handleLoadChatMessages;
