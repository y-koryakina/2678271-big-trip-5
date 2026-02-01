import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/trip-info-view.js';
import PointListView from '../view/point-list-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
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
    const pointsListContainer = pointListView.element;

    points.forEach((point) => {
      this.#renderPoint(point, destinations, offers, pointsListContainer);
    });
  }

  #renderPoint(point, destinations, offers, container) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const closeHandler = () => { //нейминг
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
