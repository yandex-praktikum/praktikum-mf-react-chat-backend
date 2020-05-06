const uuid = require('uuid');
const { getUsersForClient } = require('../users');
const { getRandomItems, getRandomDate, getRandomInt, getRandomItem  } = require('../helpers');

function generateMessage(longestMessage) {
  const MIN_MESSAGE_LENGTH = 5;
  const firstIndex = getRandomInt(0, longestMessage.length - 1 - MIN_MESSAGE_LENGTH);
  const lastIndex = getRandomInt(firstIndex + MIN_MESSAGE_LENGTH, longestMessage.length - 1);
  return longestMessage.slice(firstIndex, lastIndex);
}

function generateChatMessages(messagesNumber, authorsIDs) {
  const longestMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a risus lorem. In a semper urna, at mollis elit. Donec lorem lorem, rutrum id turpis tempor, viverra pulvinar velit. Sed at felis commodo, laoreet libero ut, scelerisque velit. Nunc ac tellus tellus. Phasellus rhoncus elit nibh, eget laoreet justo laoreet et. Ut risus nulla, tempor et tortor id, porttitor egestas odio. Ut sit amet dui mauris. Quisque id quam enim.';
  return Array(messagesNumber).fill(null).map(_ => ({
    authorID: getRandomItem(authorsIDs),
    content: generateMessage(longestMessage),
    date: getRandomDate(),
    id: uuid(),
  })).sort((a, b) => b.date - a.date);
}

const imageURL = 'react-logo.png';
const allParticipants = getUsersForClient();

function generateGroupChats(numberOfChats) {
  return Array(numberOfChats).fill(null).map(_ => {
    const participants = getRandomItems(2, allParticipants);
    const messages = generateChatMessages(200, participants.map(x => x.id));
    return {
      id: uuid(),
      type: 'group',
      name: 'Group Chat',
      participants,
      imageURL,
      messages,
    }
  });
}

function generatePrivateChats(numberOfChats) {
  const maxPrivateChatsNumber = Math.floor(allParticipants.length / 2);
  const baseArray = Array(Math.max(maxPrivateChatsNumber, numberOfChats)).fill(null);
  const participants = baseArray.reduce(
    participantsPart => [
      ...participantsPart,
      getRandomItems(2, allParticipants.filter(x => !participantsPart.find(y => y.id === x.id)))
    ],
    [],
  );
  return baseArray.map((_, i) => {
    const messages = generateChatMessages(200, participants[i].map(x => x.id));
    return {
      id: uuid(),
      type: 'private',
      deletionItems: [], // Array<{ userID, status: 'deleted' | 'restored' }>
      participants: participants[i],
      messages,
    }
  });
}

module.exports = { generateGroupChats, generatePrivateChats }
