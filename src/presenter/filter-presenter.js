import {render} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filter} from '../filter-util.js';
import {FilterType, UPDATE_TYPE} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tripModel = null;

  #filterComponent = null;


  constructor({filterContainer, filterModel, tripModel}) {
    this.#filterContainer = filterContainer;

    this.#filterModel = filterModel;
    this.#tripModel = tripModel;

    this.#filterModel.addObserver(this.#handleFilterEvent);
  }

  get filters() {
    const points = this.#tripModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](points).length
    }));
  }

  #handleFilterEvent = (updateType) => {
    const oldFilterComponent = document.querySelector('.trip-filters');
    switch(updateType) {
      case UPDATE_TYPE.FILTER:
        if (oldFilterComponent) {
          oldFilterComponent.remove();
        }
        this.init();
    }
  };

  init() {
    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    render(this.#filterComponent, this.#filterContainer);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }


    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  };
}
