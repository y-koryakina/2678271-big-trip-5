import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import {nanoid} from 'nanoid';
import {USER_ACTION, UPDATE_TYPE} from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #destinations = null;
  #offers = null;

  #pointEditComponent = null;

  constructor({pointListContainer, onDataChange, destinations, offers}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView({
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onPointDelete: this.#handleDeleteClick,
    });

    this.#pointEditComponent. _restoreHandlers();

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    this.putNewFormAfterSort();

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  putNewFormAfterSort(){
    if (this.#pointListContainer.children.length >= 2) {
      const first = this.#pointListContainer.children[0];
      const second = this.#pointListContainer.children[1];
      this.#pointListContainer.insertBefore(second, first);
    }
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }
    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    newEventButton.disabled = false;

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      USER_ACTION.ADD_TASK,
      UPDATE_TYPE.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
