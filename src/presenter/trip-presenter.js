import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor(tripModel) {
    this.model = tripModel;

    this.filtersContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points, destinations, offers } = this.model;

    render(new InfoView(), this.mainContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.filtersContainer);
    render(new SortView(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    const pointListView = new PointListView();
    render(pointListView, this.eventsContainer);
    const pointsListContainer = pointListView.getElement();

    const edPointView = new EditPointView({point: points[0], destinations, offers});
    render(edPointView, pointsListContainer);

    points.forEach((point) => {
      const pointView = new PointView({point, destinations, offers});
      render(pointView, pointsListContainer);
    });
  }
}
