const socketIO = require('socket.io'); // подумать, может уйти от либы
const {
  makeSocketMessageHandlerMaker, handleJoinChats, handleNewMessage, handleLeaveChat, handleLoadChatMessages,
  handleSearch, handleCreateChat, handleDeleteChat,
} = require('./handlers');

function configureSocket(http, sessionMiddleware) {
  const io = socketIO(http);
  io.use((socket, next) => sessionMiddleware(socket.request, {}, next)).on('connection', socket => {
    const { passport } = socket.request.session;
    const userID = passport ? passport.user : null;
    const makeMessageHandler = makeSocketMessageHandlerMaker(io, socket, userID);

    socket.on('newMessage', makeMessageHandler(handleNewMessage));
    socket.on('joinChats', makeMessageHandler(handleJoinChats));
    socket.on('leaveChat', makeMessageHandler(handleLeaveChat));
    socket.on('loadChatMessages', makeMessageHandler(handleLoadChatMessages));
    socket.on('search', makeMessageHandler(handleSearch));
    socket.on('createChat', makeMessageHandler(handleCreateChat));
    socket.on('deleteChat', makeMessageHandler(handleDeleteChat));
  });
}

module.exports = configureSocket;
