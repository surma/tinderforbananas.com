customElements.define('tinderforbananas-item', class extends HTMLElement {
  static get observedAttributes() { 
    return ['inmovable']; 
  }

  constructor() {
    super();
    this._dragging = false; 
    this.startX = 0;
    this.startY = 0;

    this._startDrag = this._startDrag.bind(this);
    this._stopDrag = this._stopDrag.bind(this);
    this._drag = this._drag.bind(this);
    this._data = {};
  }

  connectedCallback() {
    this._gBCR = this.getBoundingClientRect();
    this.addEventListener('mousedown', this._startDrag);
    document.addEventListener('mouseup', this._stopDrag); 
    document.addEventListener('mousemove', this._drag); 
    this.addEventListener('touchstart', this._startDrag);
    document.addEventListener('touchend', this._stopDrag); 
    document.addEventListener('touchmove', this._drag);

    this._actions = Array.from(this.querySelectorAll('.action'));
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
    this._updateBindings();
  }

  _updateBindings() {
    this.querySelector('.item__details__name').textContent = `${this.data.name},`;
    this.querySelector('.item__details__age').textContent = `${this.data.age}`;
    this.querySelector('.item__details__job').textContent = `${this.data.job}`;
    this.querySelector('picture').style.backgroundImage = `url('${this.data.image}')`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._inmovabe = newValue !== null;
  }

  _startDrag(event) {
    if (this._inmovable) return;
    this._dragging = true;
    this.startX = event.clientX || event.touches[0].clientX;
    this.startY = event.clientY || event.touches[0].clientY;
    event.preventDefault();
  }

  _stopDrag(event) {
    if (!this._dragging) return;
    this._dragging = false;
    const deltaX = (event.clientX || event.changedTouches[0].clientX) - this.startX;
    const deltaY = (event.clientY || event.changedTouches[0].clientY) - this.startY;

    this._actions.forEach(a => a.style.opacity = 0);
    event.preventDefault();

    if (deltaX < -this._gBCR.width / 2) return this.nope();
    if (deltaX > this._gBCR.width / 2) return this.like();
    if (deltaY < -this._gBCR.height / 2) return this.superlike();
    if (deltaX === 0 && deltaY === 0) return this.dispatchEvent(new CustomEvent('details', {detail: this.data}));
    return this._animate('initial');
  }

  _drag(event) {
    if (!this._dragging) return;

    const deltaX = (event.clientX || event.touches[0].clientX) - this.startX;
    const deltaY = (event.clientY || event.touches[0].clientY) - this.startY;

    this.style.transform = `rotate(${(deltaX) / this._gBCR.width * 15}deg) translate(${deltaX}px, ${deltaY}px)`;
    this._actions.find(a => a.classList.contains('action--nope')).style.opacity = (-deltaX - this._gBCR.width / 5) / (this._gBCR.width / 3);
    this._actions.find(a => a.classList.contains('action--like')).style.opacity = ( deltaX - this._gBCR.width / 5) / (this._gBCR.width / 3);
    this._actions.find(a => a.classList.contains('action--superlike')).style.opacity = (-deltaY - this._gBCR.height / 5) / (this._gBCR.height / 3);
    event.preventDefault();
  }

  _animate(target, opts = {}) {
    this.style.transition = 'transform 0.3s ease-in-out';
    return requestAnimationFramePromise()
      .then(_ => {
        this.style.transform = target;
        return transitionEndPromise(this);
      })
      .then(_ => {
        this.style.transition = 'initial';
      });
  }
  like(item) {
    return this._animate('translateX(200%)', {next: true})
      .then(_ => this.dispatchEvent(new Event('swipe', {type: 'like'})));
  }
  nope(item) {
    return this._animate('translateX(-200%)', {next: true})
      .then(_ => this.dispatchEvent(new Event('swipe', {type: 'nope'})));
  }
  superlike(item) {
    return this._animate('translateY(-200%)', {next: true})
      .then(_ => this.dispatchEvent(new Event('swipe', {type: 'superlike'})));
  }
});