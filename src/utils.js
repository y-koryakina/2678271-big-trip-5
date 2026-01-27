import {
  EVENT_TYPES,
  CITIES,
  LOREM_IPSUM_SENTENCES
} from './const.js';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = () => {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + getRandomInteger(1, 30));
  futureDate.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));
  return futureDate;
};

const getRandomEndDate = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + getRandomInteger(1, 12));
  endDate.setMinutes(getRandomInteger(0, 59));
  return endDate;
};

const getRandomDescription = () => {
  const sentencesCount = getRandomInteger(1, 5);
  const selectedSentences = [];

  for (let i = 0; i < sentencesCount; i++) {
    selectedSentences.push(getRandomArrayElement(LOREM_IPSUM_SENTENCES));
  }

  return selectedSentences.join(' ');
};

const getRandomPhotoUrl = () => {
  const randomId = getRandomInteger(1, 1000);
  return `https://loremflickr.com/248/152?random=${randomId}`;
};

const generatePictures = () => {
  const count = getRandomInteger(1, 5);
  return Array.from({ length: count }, (_, i) => ({
    src: getRandomPhotoUrl(),
    description: `Photo ${i + 1}`
  }));
};

const getRandomType = () => getRandomArrayElement(EVENT_TYPES);

const getRandomCity = () => getRandomArrayElement(CITIES);

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const formatDate = (date) => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  return `${month} ${day}`;
};

const formatTime = (date) => date.toTimeString().slice(0, 5);

const calculateDuration = (dateFrom, dateTo) => {
  const diffInMs = dateTo - dateFrom;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  if (hours > 0) {
    return `${hours}H ${minutes.toString().padStart(2, '0')}M`;
  }
  return `${minutes}M`;
};

const formatDateTime = (date) => date.toISOString().slice(0, 16);

export {
  getRandomArrayElement,
  getRandomInteger,
  getRandomDate,
  getRandomEndDate,
  getRandomDescription,
  getRandomPhotoUrl,
  generatePictures,
  getRandomType,
  getRandomCity,
  formatDate,
  formatTime,
  calculateDuration,
  formatDateTime
};
