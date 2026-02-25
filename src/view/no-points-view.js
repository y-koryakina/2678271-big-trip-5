import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointsMessages = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function createNoPointsTemplate(filter) {
  const message = NoPointsMessages[filter] || NoPointsMessages[FilterType.ALL];

  return `
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
      <p class="trip-events__msg">${message}</p>
    </section>
  `;
}

export default class NoPointsView extends AbstractView {
  #filter = null;

  constructor({filter}){
    super();
    this.#filter = filter;
  }

  get template() {
    return createNoPointsTemplate(this.#filter);
  }
}
