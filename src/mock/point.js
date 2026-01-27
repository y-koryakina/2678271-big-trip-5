import {
  EVENT_TYPES,
  CITIES,
  LOREM_IPSUM_SENTENCES,
  OFFERS
} from '../const.js';

import {
  getRandomArrayElement,
  getRandomInteger,
  getRandomDate,
  getRandomEndDate,
  getRandomDescription,
  generatePictures
} from '../utils.js';

const generateDestinations = () => CITIES.map((city) => ({
  id: city.toLowerCase().replace(/\s+/g, '-'),
  name: city,
  description: getRandomDescription(LOREM_IPSUM_SENTENCES),
  pictures: generatePictures()
}));

const generateOffers = () => {
  const offers = {};

  EVENT_TYPES.forEach((type) => {
    const typeOffers = OFFERS[type];
    if (typeOffers) {
      offers[type] = typeOffers.map((title, index) => ({
        id: `${type}-${index + 1}`,
        title,
        price: getRandomInteger(10, 100)
      }));
    }
  });

  return offers;
};

const createPoint = (destinations, offers) => {
  const type = getRandomArrayElement(EVENT_TYPES);
  const destination = getRandomArrayElement(destinations);

  const availableOffers = offers[type] || [];
  const selectedOffers = [];
  const offerCount = Math.min(getRandomInteger(0, 3), availableOffers.length);

  for (let i = 0; i < offerCount; i++) {
    const offer = getRandomArrayElement(availableOffers);
    if (!selectedOffers.includes(offer.id)) {
      selectedOffers.push(offer.id);
    }
  }

  const dateFrom = getRandomDate();
  const dateTo = getRandomEndDate(dateFrom);

  return {
    id: crypto.randomUUID(),
    type,
    destination: destination.id,
    dateFrom,
    dateTo,
    basePrice: getRandomInteger(50, 500),
    offers: selectedOffers,
    isFavorite: Math.random() > 0.7
  };
};

const generateMockData = () => {
  const destinations = generateDestinations();
  const offers = generateOffers();
  const points = Array.from({ length: 8 }, () => createPoint(destinations, offers));

  return { destinations, offers, points };
};

export { generateMockData };
