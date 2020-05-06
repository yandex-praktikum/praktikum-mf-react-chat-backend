const uuid = require('uuid');
const { generateGroupChats, generatePrivateChats } = require('./generators');

const groupChats = generateGroupChats(100);
const privateChats = generatePrivateChats(2);

function getGroupChats() {
  return groupChats;
}

function getPrivateChats() {
  return privateChats;
}

function getAllChats() {
  return groupChats.concat(privateChats);
}

function createPrivateChat(fromUser, toUser, message, messageDate) {
  const chat = {
    id: uuid(),
    participants: [fromUser, toUser],
    messages: [{
      id: uuid(),
      content: message,
      date: messageDate,
      authorID: fromUser.id,
    }],
    deletionItems: [], // Array<{ userID, status: 'deleted' | 'restored' }>
    type: 'private',
  };
  privateChats.push(chat);
  return chat;
}

function isUserInChat(userID, chatID) {
  const chat = getChatByID(chatID);
  return Boolean(chat && chat.participants.find(p => p.id === userID));
}

function convertPrivateChatForUser(loggedUserID, chat) {
  if (chat.type === 'private') {
    const chatUser = chat.participants.find(x => x.id !== loggedUserID);
    if (chatUser) {
      const { firstName, lastName, imageURL } = chatUser;
      const chatName = `${firstName} ${lastName}`;
      return { ...chat, name: chatName, imageURL };
    }
  }

  return chat;
}

function getUserChats(userID) {
  // можно закэшировать если что
  const privateChats = getUserPrivateChats(userID);
  const groupChats = getUserGroupChats(userID);
  return groupChats.concat(privateChats);
}

function getUserPrivateChats(userID) {
  // можно закэшировать если что
  return getPrivateChats().filter(x => isUserInChat(userID, x.id)).map(x => convertPrivateChatForUser(userID, x));
}

function getUserGroupChats(userID) {
  // можно закэшировать если что
  return getGroupChats().filter(x => isUserInChat(userID, x.id));
}

function getInitialUserChat(chat) {
  return { ...chat, messages: [chat.messages[0]] };
}

function getChatByID(chatID) {
  return getAllChats().find(x => x.id === chatID);
}

function deletePrivateChat(chatID, userID, onSuccess, onError) {
  const userPrivateChats = getUserPrivateChats(userID);
  const chatToDelete = userPrivateChats.find(x => x.id === chatID);
  if (chatToDelete) {
    const { deletionItems, participants } = chatToDelete;
    const deleteDate = (new Date()).getTime(); // TODO: подумать откуда брать время (мб с клиента)
    const existingDeletionItem = deletionItems.find(x => x.userID === userID);
    if (existingDeletionItem) {
      // user could delete, restore, and delete again
      existingDeletionItem.date = deleteDate;
      existingDeletionItem.status = 'deleted';
    } else {
      // this is the first delete by the current user
      const isChatDeletedByAllUsers = participants.every(participant =>
        deletionItems.includes(x => x.status === 'deleted' && x.userID === participant.id)
      );

      if (isChatDeletedByAllUsers) {
        // both users deleted the chat, we can really delete it
        userPrivateChats.splice(userPrivateChats.indexOf(chatToDelete), 1);
      } else {
        // keep the chat for another user
        const newDeletionItem = { userID, date: deleteDate, status: 'deleted' };
        deletionItems.push(newDeletionItem);
      }
    }
    onSuccess();
  } else {
    onError();
  }
}

// chat is restored when a user who didn't delete the chat sends a message to a user who deleted it
function restorePrivateChat(chatID, message, messageDate, fromUserID, onSuccess, onError) {
  const chat = getChatByID(chatID);
  if (chat && chat.type === 'private') {
    const { deletionItems } = chat;
    const deletionItem = deletionItems.find(x => x.userID === fromUserID && x.status === 'deleted');
    if (deletionItem) {
      deletionItem.status = 'restored';
      deletionItem.date = messageDate;
      const newMessage = { id: uuid(), content: message, date: messageDate, authorID: fromUserID };
      chat.messages.unshift(newMessage);
      onSuccess(chat);
    } else {
      // chat was not deleted; but user tries to create it
      onError();
    }
  } else {
    onError();
  }
}

module.exports = {
  getGroupChats, getPrivateChats, getAllChats, createPrivateChat, isUserInChat, getUserChats, getInitialUserChat,
  getChatByID, getUserPrivateChats, convertPrivateChatForUser, deletePrivateChat, restorePrivateChat,
};
