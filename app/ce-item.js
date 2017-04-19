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
    this._selected = 0;

  }

  connectedCallback() {
    this.addEventListener('mousedown', this._startDrag);
    document.addEventListener('mouseup', this._stopDrag); 
    document.addEventListener('mousemove', this._drag); 
    this.addEventListener('touchstart', this._startDrag);
    document.addEventListener('touchend', this._stopDrag); 
    document.addEventListener('touchmove', this._drag);

    this._actions = Array.from(this.querySelectorAll('.action'));
    this.onResize();
  }

  onResize() {
    this._gBCR = this.getBoundingClientRect();
    this._rotationLerp = lerp(0, this._gBCR.width/2, 0, 10, {noClamp: true});
    this._nopeOpacityLerp = lerp(0, -this._gBCR.width/3, 0, 1);
    this._likeOpacityLerp = lerp(0, this._gBCR.width/3, 0, 1);
    this._superlikeOpacityLerp = lerp(-this._gBCR.height/8, -this._gBCR.height/8 - this._gBCR.height/3, 0, 1);
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
    this._updateBindings();
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
    this._updateBindings();
  }

  _updateBindings() {
    this.querySelector('.item__details__name').textContent = `${this.data.name}`;
    this.querySelector('.item__details__age').textContent = `${this.data.age}`;
    this.querySelector('.item__details__job').textContent = `${this.data.job}`;
    this.querySelector('picture').style.backgroundImage = `url('${this.data.images[this.selected]}')`;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._inmovable = newValue !== null;
  }

  _startDrag(event) {
    if (this._inmovable) return;
    this._dragging = true;
    this.startX = event.clientX || event.touches[0].clientX;
    this.startY = event.clientY || event.touches[0].clientY;
    event.preventDefault();
  }

  _stopDrag(event) {
    if (this._inmovable) return;
    if (!this._dragging) return;
    this._dragging = false;
    const deltaX = (event.clientX || event.changedTouches[0].clientX) - this.startX;
    const deltaY = (event.clientY || event.changedTouches[0].clientY) - this.startY;

    this._actions.forEach(a => a.style.opacity = 0);
    event.preventDefault();

    if (this._superlikeOpacityLerp(deltaY) >= 1) return this.superlike();
    if (this._nopeOpacityLerp(deltaX) >= 1) return this.nope();
    if (this._likeOpacityLerp(deltaX) >= 1) return this.like();
    if (deltaX === 0 && deltaY === 0) return this.dispatchEvent(new CustomEvent('details', {detail: this.data, bubbles: true}));
    return this._animate('initial');
  }

  _drag(event) {
    if (this._inmovable) return;
    if (!this._dragging) return;

    const deltaX = (event.clientX || event.touches[0].clientX) - this.startX;
    const deltaY = (event.clientY || event.touches[0].clientY) - this.startY;

    this.style.transform = `rotate(${this._rotationLerp(deltaX)}deg) translate(${deltaX}px, ${deltaY}px)`;
    this._actions.find(a => a.classList.contains('action--nope')).style.opacity = this._nopeOpacityLerp(deltaX);
    this._actions.find(a => a.classList.contains('action--like')).style.opacity = this._likeOpacityLerp(deltaX);
    this._actions.find(a => a.classList.contains('action--superlike')).style.opacity = this._superlikeOpacityLerp(deltaY);
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
      .then(_ => this.dispatchEvent(new CustomEvent('swipe', {detail: 'like'})));
  }
  nope(item) {
    return this._animate('translateX(-200%)', {next: true})
      .then(_ => this.dispatchEvent(new CustomEvent('swipe', {detail: 'nope'})));
  }
  superlike(item) {
    return this._animate('translateY(-200%)', {next: true})
      .then(_ => this.dispatchEvent(new CustomEvent('swipe', {detail: 'superlike'})));
  }
});