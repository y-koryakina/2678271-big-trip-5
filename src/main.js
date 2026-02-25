import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Model from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

const mainContainer = document.querySelector('.trip-main');

const newEventButton = document.querySelector('.trip-main__event-add-btn');

const tripModel = new Model();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  tripModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: mainContainer,
  filterModel,
  tripModel
});

newEventButton.addEventListener('click', handleNewPointButtonClick);

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newEventButton.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
