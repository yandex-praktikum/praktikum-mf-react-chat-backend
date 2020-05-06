const { getUserByID, convertUserForClient } = require('../../mockData/users');
const { createPrivateChat, convertPrivateChatForUser, getUserPrivateChats, restorePrivateChat } = require('../../mockData/chats');

function createChatForSocket(socket, chat, socketUserID) {
  socket.join(chat.id);
  socket.emit('createChat', { chat: convertPrivateChatForUser(socketUserID, chat) });
}

const isUserSocket = userID => socket => {
  const { request: { session: { passport } } } = socket;
  return Boolean(passport && passport.user === userID);
}

// TODO: надо везде пройтись по бэкенду и посмотреть, чтобы нельзя было всякую дичь с клиента слать
// типа создания какого-то левого чата для левых юзеров и т.д.
// created with a message sending
function handleCreateChat({ io, socket: fromUserSocket, userID: fromUserID }, { userID: toUserID, message, messageDate }) {
  const fromUser = getUserByID(fromUserID);
  const toUser = getUserByID(toUserID);
  if (fromUser && toUser) {
    const toUserSocket = Object.values(io.clients().sockets).find(isUserSocket(toUserID));
    // user could delete a chat; don't need to create a new one in that case
    const existingChat = getUserPrivateChats(fromUser.id).find(c => c.participants.find(p => p.id === toUser.id));
    if (existingChat) {
      restorePrivateChat(
        existingChat.id,
        message,
        messageDate,
        fromUser.id,
        chat => {
          createChatForSocket(
            fromUserSocket,
            { ...chat, messages: [chat.messages.reduce((acc, x) => acc.date > x.date ? acc : x)] },
            fromUserID
          );
          toUserSocket && toUserSocket.emit('newMessage', {
            message,
            authorID: newMessage.authorID,
            date: newMessage.date,
            id: newMessage.id,
            chatID,
          });
        },
        () => fromUserSocket.emit('serverError', { message: 'The chat is already created' }),
      );
    } else {
      const chat = createPrivateChat(convertUserForClient(fromUser), convertUserForClient(toUser), message, messageDate);
      // update sender
      createChatForSocket(fromUserSocket, chat, fromUserID)
      // update reciever if it's connected
      toUserSocket && createChatForSocket(toUserSocket, chat, toUserID);
    }
  }
  // елсе: ерроры слать?
}

module.exports = handleCreateChat;
