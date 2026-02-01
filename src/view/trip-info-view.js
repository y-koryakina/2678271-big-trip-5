import AbstractView from '../framework/view/abstract-view.js';

function createInfoTemplate(infoData) {
  const { title, dates, totalCost } = infoData;

  if (!title && !dates.start && !dates.end && totalCost === 0) {
    return '<div></div>';
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dates.start}&nbsp;&mdash;&nbsp;${dates.end}</p>
      </div>
      <p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span></p>
    </section>`
  );
}

export default class InfoView extends AbstractView {
  #infoData = null;

  constructor(infoData = {}) {
    super();
    this.#infoData = {
      title: infoData.title || '',
      dates: {
        start: infoData.dates?.start || '',
        end: infoData.dates?.end || ''
      },
      totalCost: infoData.totalCost || 0
    };
  }

  get template() {
    return createInfoTemplate(this.#infoData);
  }
}
