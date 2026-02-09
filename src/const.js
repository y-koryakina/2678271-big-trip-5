const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const CITIES = [
  'Amsterdam',
  'Geneva',
  'Chamonix',
  'Berlin',
  'Prague',
  'London',
  'Paris',
  'Rome',
  'Madrid',
  'Vienna',
  'Brussels',
  'Zurich'
];

const LOREM_IPSUM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const OFFERS = {
  taxi: ['Extra luggage', 'Child seat'],
  bus: ['Wi-Fi', 'Snacks'],
  train: ['First class', 'Dining car'],
  ship: ['Cabin upgrade', 'Excursion'],
  drive: ['GPS', 'Child seat'],
  flight: ['Add luggage', 'Priority check-in'],
  'check-in': ['Breakfast included', 'Late check-out'],
  sightseeing: ['Guide', 'Skip the line'],
  restaurant: ['Wine pairing', 'Dessert']
};

const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
  EVENT: 'event',
  OFFER: 'offer'
};

export {
  EVENT_TYPES,
  CITIES,
  LOREM_IPSUM_SENTENCES,
  OFFERS,
  SORT_TYPE
};
