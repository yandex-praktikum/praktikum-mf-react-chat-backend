const { getUserChats, getInitialUserChat } = require('../../mockData/chats');

function handleJoinChats({ socket, userID }) {
  // надо добавить пагинацию.
  const userChats = getUserChats(userID);
  if (userChats.length > 0) {
    userChats.forEach(chat => socket.join(chat.id));
    const chatIsNotDeleted =  chat => !(chat.type === 'private'
      && chat.deletionItems.find(x => x.userID === userID && x.status === 'deleted'));
    // userChats.forEach(x => console.log(x.deletionItems, x.name));
    socket.emit('joinChats', {
      chats: userChats.filter(chatIsNotDeleted).map(getInitialUserChat),
    });
  }
}

module.exports = handleJoinChats;
