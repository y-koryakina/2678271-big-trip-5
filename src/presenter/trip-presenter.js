import SortView from '../view/sort-view.js';
import InfoView from '../view/trip-info-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION, FilterType } from '../const.js';
import {filter} from '../filter-util.js';
import NewPointPresenter from './new-point-presenter.js';

import {
  getInfoTitle,
  getInfoDates,
  getTotalCost,
} from '../utils.js';

export default class TripPresenter {
  #pointPresenters = new Map();
  #currentSortType = SORT_TYPE.DAY;
  #filterModel = null;
  #model = null;
  #newPointPresenter = null;

  constructor({tripModel, filterModel}) {
    this.#model = tripModel;
    this.#filterModel = filterModel;

    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);


    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.eventsContainer,
      onDataChange: this.#handleViewAction,
      destinations: this.#model.destinations,
      offers: this.#model.offers
    });
  }


  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#model.points);

    return this.#sortPoints(filteredPoints, this.#currentSortType);
  }

  init() {
    const {destinations, offers } = this.#model;

    const points = this.points;
    const infoData = {
      title: getInfoTitle(points, destinations),
      dates: getInfoDates(points),
      totalCost: getTotalCost(points, offers),
    };

    render(new InfoView(infoData), this.mainContainer, RenderPosition.AFTERBEGIN);

    if (!points || points.length === 0) {


      render(new NoPointsView({filter: this.#filterModel.filter}), this.eventsContainer);
      return;
    }

    render(new SortView({onSortChange: this.#handleSortChange}), this.eventsContainer, RenderPosition.AFTERBEGIN);

    this.#renderSortedpoints();

  }

  createPoint() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, FilterType.ALL);

    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#renderSortedpoints();
  };

  #handlePointChange = (updatedPoint) => {
    const index = this.#model.points.findIndex((p) => p.id === updatedPoint.id);

    this.#model.points[index] = updatedPoint;

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case USER_ACTION.UPDATE_TASK:
        this.#model.updatePoint(updateType, update);
        break;
      case USER_ACTION.ADD_TASK:
        this.#model.addPoint(updateType, update);
        break;
      case USER_ACTION.DELETE_TASK:

        this.#model.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    const oldInfo = this.mainContainer.querySelector('.trip-info');
    const oldSort = this.eventsContainer.querySelector('.trip-events__trip-sort');
    const oldNoPoints = this.eventsContainer.querySelector('.trip-events__msg');

    switch (updateType) {

      case UPDATE_TYPE.PATCH:

        if (this.points.find((point) => point.id === data.id)) {
          this.#pointPresenters.get(data.id).init(data);
        } else {
          const presenter = this.#pointPresenters.get(data.id);
          if (presenter) {
            presenter.destroy();
            this.#pointPresenters.delete(data.id);
          }
        }
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearPoints();
        this.#renderPoints(this.points, this.#model.destinations, this.#model.offers);
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearPoints();
        if (oldInfo) {
          oldInfo.remove();
        }

        if (oldSort) {
          oldSort.remove();
        }
        this.#currentSortType = SORT_TYPE.DAY;

        if (oldNoPoints) {
          oldNoPoints.remove();
        }
        this.init();
        break;
    }
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.eventsContainer,
        onDataChange: this.#handleViewAction,
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

  #renderSortedpoints = () => {
    this.#clearPoints();
    this.#renderPoints(this.points, this.#model.destinations, this.#model.offers);
  };
}
