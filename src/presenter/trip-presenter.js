import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor() {
    this.filtersContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');
  }

  init() {
    render(new InfoView(), this.mainContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.filtersContainer);
    render(new EditPointView(), this.eventsContainer, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventsContainer);
    }
  }
}
