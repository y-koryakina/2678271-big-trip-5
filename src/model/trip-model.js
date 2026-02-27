import Observable from '../framework/observable.js';
import { UPDATE_TYPE } from '../const.js';

export default class Model extends Observable {
  #pointsApiService = null;
  #points = [];
  destinations = null;
  offers = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const [destinations, offers, points] = await Promise.all([
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers,
        this.#pointsApiService.points
      ]);

      this.destinations = destinations;
      this.offers = offers;
      this.#points = points.map(this.#adaptToClient);

    } catch(err) {
      throw new Error('Can\'t update task');
    }

    this._notify(UPDATE_TYPE.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try{
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedTask = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedTask,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedTask);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  #adaptToClient(task) {
    const adaptedPoint = {...task,
      dateTo: task['date_to'] !== null ? new Date(task['date_to']) : task['date_to'],
      dateFrom: task['date_from'] !== null ? new Date(task['date_from']) : task['date_from'],
      isFavorite: task['is_favorite'],
      basePrice: task['base_price'],
    };

    delete adaptedPoint['date_to'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }
}

