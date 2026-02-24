import Observable from '../framework/observable.js';
import {FilterType, UPDATE_TYPE} from '../const.js';

export default class FilterModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  resetFilter() {
    this._notify(UPDATE_TYPE.FILTER);
  }
}
