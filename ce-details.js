customElements.define('tinderforbananas-details', class extends HTMLElement {
  static get observedAttributes() { 
    return []; 
  }

  constructor() {
    super();
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
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

});