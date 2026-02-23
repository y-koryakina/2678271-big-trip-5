import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

function createNoPointsTemplate(filter) {
  switch (filter) {
    case FilterType.ALL:
      return `
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>
          <p class="trip-events__msg">Click New Event to create your first point</p>
        </section>
      `;
    case FilterType.FUTURE:
      return `
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>
          <p class="trip-events__msg">There are no future events now</p>
        </section>
      `;
    case FilterType.PRESENT:
      return `
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>
          <p class="trip-events__msg">There are no present events now</p>
        </section>
      `;
    case FilterType.PAST:
      return `
        <section class="trip-events">
          <h2 class="visually-hidden">Trip events</h2>
          <p class="trip-events__msg">There are no past events now</p>
        </section>
      `;
  }
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
