import {
  formatDate,
  formatTime,
  calculateDuration,
  formatDateTime
} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';


function createPointTemplate(point, destination, typeOffers) {
  const {
    type,
    dateFrom,
    dateTo,
    basePrice,
    offers: selectedOfferIds,
    isFavorite
  } = point;

  const dateFormatted = formatDate(dateFrom);
  const dateTimeFrom = formatDateTime(dateFrom);
  const dateTimeTo = formatDateTime(dateTo);
  const timeFrom = formatTime(dateFrom);
  const timeTo = formatTime(dateTo);
  const duration = calculateDuration(dateFrom, dateTo);

  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  const selectedOffers = typeOffers.filter((offer) => selectedOfferIds.includes(offer.id));
  const offersTemplate = selectedOffers.length > 0 ? `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${selectedOffers.map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
      `).join('')}
    </ul>
  ` : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateTimeFrom}">${dateFormatted}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeFrom}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTimeTo}">${timeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${offersTemplate}
        <button class="event__favorite-btn ${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #typeOffers = null;
  #handleArrowClick = null;
  #handleStarClick = null;

  constructor({ point, destination, typeOffers, onArrowClick, onStarClick }) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#typeOffers = typeOffers || [];
    this.#handleArrowClick = onArrowClick;
    this.#handleStarClick = onStarClick;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#typeOffers);
  }

  setHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#ArrowClickHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#StarClickHandler);
  }

  #ArrowClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleArrowClick();
  };

  #StarClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleStarClick();
  };
}
