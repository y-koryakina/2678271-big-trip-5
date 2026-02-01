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

const formatDateForTitle = (date) => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate().toString().padStart(2, '0');
  return `${day} ${month.toUpperCase()}`;
};

const getInfoTitle = (points, destinations) => {
  if (!points || !points.length) {
    return '';
  }

  const destinationNames = points.map((point) => {
    const destination = destinations.find((d) => d.id === point.destination);
    return destination ? destination.name : '';
  });

  destinationNames.filter((element) => element);

  if (destinationNames.length <= 3) {
    return destinationNames.join(' — ');
  }

  const first = destinationNames[0];
  const last = destinationNames[destinationNames.length - 1];

  return `${first} —... — ${last}`;
};

const getInfoDates = (points) => {
  if (!points.length) {
    return null;
  }

  const sortedPoints = [...points].sort((a, b) =>
    new Date(a.dateFrom) - new Date(b.dateFrom)
  );

  return {
    start: formatDateForTitle(sortedPoints[0].dateFrom),
    end: formatDateForTitle(sortedPoints[sortedPoints.length - 1].dateTo)
  };
};

function getTotalCost(points, offers) {
  return points.reduce((total, point) => {
    const pointOffers = offers[point.type];
    const selectedOffersCost = pointOffers
      .filter((offer) => point.offers.includes(offer.id))
      .reduce((sum, offer) => sum + offer.price, 0);
    return total + point.basePrice + selectedOffersCost;
  }, 0);
}

const countFuturePoints = (points) => {
  const now = new Date();
  return points.filter((point) => new Date(point.dateFrom) > now).length;
};

const countPresentPoints = (points) => {
  const now = new Date();
  return points.filter((point) =>
    new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
  ).length;
};

const countPastPoints = (points) => {
  const now = new Date();
  return points.filter((point) => new Date(point.dateTo) < now).length;
};

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
  formatDateTime,
  formatDateForTitle,
  getInfoTitle,
  getInfoDates,
  getTotalCost,
  countFuturePoints,
  countPresentPoints,
  countPastPoints
};
