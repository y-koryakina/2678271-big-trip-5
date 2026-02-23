import {EVENT_TYPES} from '../const.js';
import {
  formatDate,
  formatTime,
} from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';


import 'flatpickr/dist/flatpickr.min.css';


function createEditPointTemplate(point = {}, destinations = [], offers = {}, isNewPoint = false) {
  const {
    type = EVENT_TYPES[0],
    destination: destinationId = '',
    dateFrom = new Date(),
    dateTo = new Date(),
    basePrice = 0,
    offers: selectedOfferIds = [],
  } = point;

  const destination = destinations.find((dest) => dest.id === destinationId) || destinations[0] || {name: '', description: '', pictures: []};
  const typeOffers = offers[type] || [];
  const selectedOffers = typeOffers.filter((offer) => selectedOfferIds.includes(offer.id));

  const dateFormatted = formatDate(dateFrom);
  const timeFrom = formatTime(dateFrom);
  const timeTo = formatTime(dateTo);

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input
        id="event-type-${eventType}-1"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${eventType === type ? 'checked' : ''}
      >
      <label class="event__type-label event__type-label--${eventType}" for="event-type-${eventType}-1">
        ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}
      </label>
    </div>
  `).join('');

  const destinationsTemplate = destinations.map((dest) => `
    <option value="${dest.id}">${dest.name}</option>
  `).join('');

  const offersTemplate = typeOffers.length > 0 ? `
    <section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${typeOffers.map((offer) => `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${offer.id}"
              type="checkbox"
              name="event-offer-${offer.id}"
              value="${offer.id}"
              ${selectedOffers.some((selected) => selected.id === offer.id) ? 'checked' : ''}
            >
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  const destinationDescriptionTemplate = destination.description ? `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${destination.pictures.length > 0 ? `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${destination.pictures.map((pic) => `
              <img class="event__photo" src="${pic.src}" alt="${pic.description}">
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  ` : '';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${destination.name}"
              list="destination-list-1"
              required
            >
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFormatted} ${timeFrom}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateFormatted} ${timeTo}"
            >
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="number"
              name="event-price"
              value="${basePrice}"
              min="0"
              required
            >
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${!isNewPoint ? 'Delete' : 'Cancel'}</button>
          ${!isNewPoint ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationDescriptionTemplate}
        </section>
      </form>
    </li>
  `;
}

export default class EditPointView extends AbstractStatefulView{
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handlePointDelete = null;
  #handleArrowClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = false;


  constructor({point = null, destinations = [], offers = {}, onFormSubmit, onPointDelete, onArrowClick = null}) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handlePointDelete = onPointDelete;
    this.#handleArrowClick = onArrowClick;
    this.#isNewPoint = point === null;

    const initialState = point || this.#getDefaultPoint();
    this._setState({ ...initialState });

  }

  #getDefaultPoint() {
    return {
      type: 'flight',
      destination: 'madrid',
      dateFrom: new Date(),
      dateTo: new Date(),
      basePrice: 0,
      offers: [],
      isFavorite: false
    };
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #dateFromChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this.updateElement({
      dateFrom: userDate,
      dateTo: dayjs(userDate).isAfter(this._state.dateTo) ? userDate : this._state.dateTo
    });

    if (this.#datepickerTo) {
      this.#datepickerTo.set('minDate', userDate);
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    if (!userDate) {
      return;
    }

    this.updateElement({
      dateTo: userDate
    });

    if (this.#datepickerFrom) {
      this.#datepickerFrom.set('maxDate', userDate);
    }
  };

  #setDatepickers() {
    const dateFromInput = this.element.querySelector('#event-start-time-1');
    const dateToInput = this.element.querySelector('#event-end-time-1');

    const dateFormat = 'd/m/y H:i';

    if (dateFromInput) {
      this.#datepickerFrom = flatpickr(dateFromInput, {
        dateFormat: dateFormat,
        defaultDate: this._state.dateFrom,
        enableTime: true,
        time_24hr: true, // eslint-disable-line camelcase
        minDate: 'today',
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      });
    }

    if (dateToInput) {
      this.#datepickerTo = flatpickr(dateToInput, {
        dateFormat: dateFormat,
        defaultDate: this._state.dateTo,
        enableTime: true,
        time_24hr: true, // eslint-disable-line camelcase
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      });
    }
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offers, this.#isNewPoint);
  }

  _createElement() {
    const element = super._createElement();
    this._restoreHandlers();
    return element;
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#pointDeleteHandler);

    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn && !this.#isNewPoint) {
      rollupBtn.addEventListener('click', this.#ArrowClickHandler);
    }

    this.#setTypeChangeHandler();
    this.#setDestinationChangeHandler();

    this.#setDatepickers();
    this.#setOffersChangeHandler();
  }

  #setOffersChangeHandler() {
    const offersContainer = this.element.querySelector('.event__available-offers');
    if (!offersContainer) {
      return;
    }

    offersContainer.addEventListener('change', (evt) => {
      if (evt.target.classList.contains('event__offer-checkbox')) {
        const offerId = evt.target.value;
        const isChecked = evt.target.checked;

        let newOffers = [...this._state.offers];

        if (isChecked) {
          newOffers.push(offerId);
        } else {
          newOffers = newOffers.filter((id) => id !== offerId);
        }

        this.updateElement({
          offers: newOffers
        });
      }
    });
  }

  #setTypeChangeHandler() {
    const typeGroup = this.element.querySelector('.event__type-group');
    typeGroup.addEventListener('change', (evt) => {
      if (evt.target.name === 'event-type') {
        evt.preventDefault();
        const newType = evt.target.value;

        this.updateElement({
          type: newType,
          offers: []
        });
      }
    });
  }

  #setDestinationChangeHandler() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    destinationInput.addEventListener('change', (evt) => {
      evt.preventDefault();
      const destinationId = evt.target.value;

      this.updateElement({
        destination: destinationId
      });
    });
  }

  #formSubmitHandler = (evt) => {

    evt.preventDefault();
    const priceInput = this.element.querySelector('.event__input--price');
    const price = parseInt(priceInput.value, 10) || 0;
    const updatedPoint = {
      ...this._state,
      basePrice: price,
    };
    this.#handleFormSubmit(updatedPoint);
  };

  #pointDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handlePointDelete(this._state);
  };

  #ArrowClickHandler = () => {
    this.#handleArrowClick();
  };
}
