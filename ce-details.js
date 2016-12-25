customElements.define('tinderforbananas-details', class extends HTMLElement {
  static get observedAttributes() { 
    return []; 
  }

  constructor() {
    super();
    this._carousel = this.querySelector('tinderforbananas-carousel');
  }

  connectedCallback() {
    this._carousel.addEventListener('click', _ => this.dispatchEvent(new CustomEvent('dismiss')));
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
    this.querySelector('tinderforbananas-carousel').style.backgroundImage = `url(${this.data.image})`;
    this.querySelector('.item__details__name').textContent = this.data.name;
    this.querySelector('.item__details__age').textContent = this.data.age;
    this.querySelector('.item__details__job').textContent = this.data.job;
    this.querySelector('.item__details__distance').textContent = `${this.data.distance} miles away`;
    this.querySelector('.description').textContent = this.data.description;
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

});