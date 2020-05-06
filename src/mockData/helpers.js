function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(itemsNumber, array) {
  return Array(itemsNumber).fill(null).reduce(arrayWithRandomItems => {
    const sourceArray = array.filter(x => !arrayWithRandomItems.includes(x));
    return arrayWithRandomItems.concat([getRandomItem(sourceArray)]);
  }, []);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

function getRandomDate() {
  const currentDate = (new Date()).getTime();
  const DAY_IN_MILLISECONDS = 1000 * 3600 * 24;
  return (new Date(getRandomInt(currentDate - DAY_IN_MILLISECONDS * 30, currentDate))).getTime();
}

module.exports = { getRandomDate, getRandomInt, getRandomItem, getRandomItems };
