import responseData from './responses.json';

const getResponse = (message) => {
  const messageLC = message.toLowerCase();
  for (const key in responseData) {
    if (messageLC.includes(key)) {
      const responses = responseData[key];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  const defaultResponses = responseData['default'];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

export default getResponse;
