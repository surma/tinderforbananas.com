customElements.define('tinderforbananas-details', class extends HTMLElement {
  constructor() {
    super();
    this._carousel = this.querySelector('tinderforbananas-carousel');
  }

  connectedCallback() {
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
    this._updateBindings();
  }

  _updateBindings() {
    if(!this.data) return;
    this._carousel.selected = 0;
    while(this._carousel.firstChild) this._carousel.removeChild(this._carousel.firstChild);
    for(let imgSrc of this.data.images) {
      const div = document.createElement('div');
      div.classList.add('carousel__item');
      div.style.backgroundImage = `url('${imgSrc}')`;
      this._carousel.appendChild(div);
    }
    this.querySelector('.item__details__name').textContent = this.data.name;
    this.querySelector('.item__details__age').textContent = this.data.age;
    this.querySelector('.item__details__job').textContent = this.data.job;
    this.querySelector('.item__details__distance').textContent = `${this.data.distance} miles away`;
    this.querySelector('.description').textContent = this.data.description;
  }
});