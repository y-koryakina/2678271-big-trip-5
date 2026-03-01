import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import {USER_ACTION, UPDATE_TYPE} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #destinations = null;
  #offers = null;

  constructor({ container, onDataChange, onModeChange, destinations, offers }) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const destinationObj = this.#destinations.find(
      (d) => d.id === point.destination
    );

    const allOffers = this.#offers;
    const typeOffers = allOffers.filter((offer) => offer.type === point.type) || [];

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: destinationObj,
      typeOffers,
      onArrowClick: this.#handleEditClick,
      onStarClick: this.#handleFavoriteClick,
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onPointDelete: this.#handlePointDelete,
      onArrowClick: this.#handleCloseClick,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    this.#handleModeChange();
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#pointEditComponent._restoreHandlers();

    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleCloseClick = () => {
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_TASK,
      UPDATE_TYPE.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite, }
    );
  };

  #handleFormSubmit = (updatedPoint, updateType) => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_TASK,
      updateType,
      updatedPoint,
    );
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handlePointDelete = (updatedPoint) => {
    this.#handleDataChange(
      USER_ACTION.DELETE_TASK,
      UPDATE_TYPE.MINOR,
      updatedPoint,
    );

  };
}
