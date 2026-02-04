import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
import {getInfoTitle, getInfoDates, getTotalCost, countFuturePoints, countPresentPoints, countPastPoints} from '../utils.js';
export default class TripPresenter {

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
      totalCost: getTotalCost(points, offers)
    };

    const filtersInfo = {
      future: countFuturePoints(points),
      present: countPresentPoints(points),
      past: countPastPoints(points)
    };

    render(new InfoView(infoData), this.mainContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(filtersInfo), this.filtersContainer);

    if (!points || !points.length) {
      render(new NoPointsView(), this.eventsContainer);
    } else {
      render(new SortView(), this.eventsContainer, RenderPosition.AFTERBEGIN);

      const pointListView = new PointListView();
      render(pointListView, this.eventsContainer);
      const pointsListContainer = pointListView.element;

      points.forEach((point) => {
        this.#renderPoint(point, destinations, offers, pointsListContainer);
      });
    }
  }

  #renderPoint(point, destinations, offers, container) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const closeHandler = () => {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const taskComponent = new PointView({
      point, destinations, offers,
      onArrowClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const taskEditComponent = new EditPointView({
      point, destinations, offers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onArrowClick: closeHandler
    });

    function replaceCardToForm() {
      replace(taskEditComponent, taskComponent);
    }

    function replaceFormToCard() {
      replace(taskComponent, taskEditComponent);
    }

    render(taskComponent, container);
  }
}
