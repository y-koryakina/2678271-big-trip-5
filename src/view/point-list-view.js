import {createElement} from '../render.js';

function createPointListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointListView {
  getTemplate() {
    return createPointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
