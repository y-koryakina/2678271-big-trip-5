import TripPresenter from './presenter/trip-presenter.js';
import Model from './model/trip-model.js';

const tripModel = new Model();
const tripPresenter = new TripPresenter(tripModel);

tripPresenter.init();
