import SortView from '../view/sort-view.js';
import InfoView from '../view/trip-info-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION, FilterType } from '../const.js';
import {filter} from '../filter-util.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import { putSortUpper } from '../utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import {
  getInfoTitle,
  getInfoDates,
  getTotalCost,
} from '../utils.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #pointPresenters = new Map();
  #currentSortType = SORT_TYPE.DAY;
  #filterModel = null;
  #model = null;
  #newPointPresenter = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripModel, filterModel}) {
    this.#model = tripModel;
    this.#filterModel = filterModel;

    this.eventsContainer = document.querySelector('.trip-events');
    this.mainContainer = document.querySelector('.trip-main');

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#model.points);
    return this.#sortPoints(filteredPoints, this.#currentSortType);
  }

  init() {
    this.#renderHeader();

    render(new SortView({onSortChange: this.#handleSortChange}), this.eventsContainer, RenderPosition.AFTERBEGIN);

    this.#clearPoints();
    this.#renderPoints(this.points, this.#model.destinations, this.#model.offers);
  }

  createPoint() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, FilterType.ALL);
    this.#filterModel.resetFilter();
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

    this.#clearPoints();
    this.#renderPoints(this.points, this.#model.destinations, this.#model.offers);
  };

  #handleViewAction = async(actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case USER_ACTION.UPDATE_TASK:
        this.#pointPresenters.get(update.id).setSaving();

        try {
          await this.#model.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case USER_ACTION.ADD_TASK:
        this.#newPointPresenter.setSaving();
        try {
          await this.#model.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case USER_ACTION.DELETE_TASK:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#model.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderHeader();

        this.#newPointPresenter = new NewPointPresenter({
          pointListContainer: this.eventsContainer,
          onDataChange: this.#handleViewAction,
          destinations: this.#model.destinations,
          offers: this.#model.offers
        });

        this.#renderPoints(this.points, this.#model.destinations, this.#model.offers);
        break;
    }
  };

  #renderHeader(){
    render(new InfoView({
      title: getInfoTitle(this.#model.points, this.#model.destinations),
      dates: getInfoDates(this.#model.points),
      totalCost: getTotalCost(this.#model.points, this.#model.offers),
    }), this.mainContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPoints(points, destinations, offers) {
    if (this.#isLoading) {
      this.#renderLoading();
      putSortUpper(this.eventsContainer);
      return;
    }
    if (!points || points.length === 0) {
      render(new NoPointsView({filter: this.#filterModel.filter}), this.eventsContainer);
      return;
    }

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

  #renderLoading() {
    render(this.#loadingComponent, this.eventsContainer, RenderPosition.AFTERBEGIN);
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
}
