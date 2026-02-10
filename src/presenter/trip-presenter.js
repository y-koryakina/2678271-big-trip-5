import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import InfoView from '../view/trip-info-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SORT_TYPE } from '../const.js';

import {
  getInfoTitle,
  getInfoDates,
  getTotalCost,
  countFuturePoints,
  countPresentPoints,
  countPastPoints,
} from '../utils.js';

export default class TripPresenter {
  #pointPresenters = new Map();
  #currentSortType = SORT_TYPE.DAY;

  constructor(tripModel) {
    this.model = tripModel;

    this.filtersContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');
  }

  init() {
    const { points, destinations, offers } = this.model;

    const infoData = {
      title: getInfoTitle(points, destinations),
      dates: getInfoDates(points),
      totalCost: getTotalCost(points, offers),
    };

    const filtersInfo = {
      future: countFuturePoints(points),
      present: countPresentPoints(points),
      past: countPastPoints(points),
    };

    render(new InfoView(infoData), this.mainContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(filtersInfo), this.filtersContainer);

    if (!points || points.length === 0) {
      render(new NoPointsView(), this.eventsContainer);
      return;
    }

    render(new SortView({onSortChange: this.#handleSortChange}), this.eventsContainer, RenderPosition.AFTERBEGIN);

    this.#renderSortedpoints(this.#currentSortType);

  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#renderSortedpoints(sortType);
  };

  #handlePointChange = (updatedPoint) => {
    const index = this.model.points.findIndex((p) => p.id === updatedPoint.id);

    this.model.points[index] = updatedPoint;

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.eventsContainer,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
        destinations,
        offers,
      });

      pointPresenter.init(point);

      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #sortPoints = (points, sortType) => {
    const sortedPoints = [...points];

    switch (sortType) {
      case SORT_TYPE.DAY:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;

      case SORT_TYPE.TIME:
        sortedPoints.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });
        break;

      case SORT_TYPE.PRICE:
        sortedPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;

      default:
        sortedPoints.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
        break;
    }
    return sortedPoints;
  };

  #renderSortedpoints = (sortType) => {
    const sortedPoints = this.#sortPoints(this.model.points, sortType);
    this.#clearPoints();
    this.#renderPoints(sortedPoints, this.model.destinations, this.model.offers);
  };
}
