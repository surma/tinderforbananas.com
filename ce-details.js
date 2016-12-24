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
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

});