customElements.define('tinderforbananas-carousel', class extends HTMLElement {
  constructor() {
    super();
    const mo = new MutationObserver(this.updateChildren.bind(this));
    mo.observe(this, {childList: true});
    this.selected = 0;
    this._startDrag = this._startDrag.bind(this);
    this._stopDrag = this._stopDrag.bind(this);
    this._drag = this._drag.bind(this);
    this._dragging = false;
  }

  connectedCallback() {
    this.updateChildren();
    this.addEventListener('mousedown', this._startDrag);
    this.addEventListener('touchstart', this._startDrag);
    document.addEventListener('mousemove', this._drag);
    document.addEventListener('touchmove', this._drag);
    document.addEventListener('mouseup', this._stopDrag);
    document.addEventListener('touchend', this._stopDrag);
  }

  _startDrag(event) {
    this._dragging = true;
    this._startX = event.clientX || event.touches[0].clientX;
    event.preventDefault();
    event.stopPropagation();
  }

  _drag(event) {
    if (!this._dragging) return;
    let deltaX = (event.clientX || event.touches[0].clientX) - this._startX;
    const maxDelta = this._width * (this._images.length - this.selected);
    if (this.selected === 0 && deltaX > 0) deltaX = 0;
    if (this.selected === this._images.length-1 && deltaX < 0) deltaX = 0;
    this._images.forEach(img => img.style.transform = `translateX(${deltaX}px)`);
    event.preventDefault();
    event.stopPropagation();
  }

  _stopDrag(event) {
    if (!this._dragging) return;
    this._dragging = false;
    let deltaX = (event.clientX || event.changedTouches[0].clientX) - this._startX;
    if (Math.abs(deltaX) < 10) return this.dispatchEvent(
      new CustomEvent('dismiss', {
        detail: {
          selected: this.selected
        },
        bubbles: true
      })
    );
    if (this.selected === 0 && deltaX > 0) deltaX = 0;
    if (this.selected === this._images.length-1 && deltaX < 0) deltaX = 0;

    let idxOffset = 0;
    if (deltaX > this._width/4) idxOffset = 1;
    if (deltaX < -this._width/4) idxOffset = -1;
    this.selected -= idxOffset;
    
    const r1 = this._images[0].getBoundingClientRect();
    this.updateChildren();
    const r2 = this._images[0].getBoundingClientRect();
    this._images.forEach(img => img.style.transform = `translateX(${r1.left - r2.left}px)`);

    requestAnimationFramePromise()
      .then(_ => requestAnimationFramePromise())
      .then(_ => {
        this._images.forEach(img => {
          img.style.transition = 'transform 0.1s ease-in-out';
        });
      })
      .then(_ => requestAnimationFramePromise())
      .then(_ => requestAnimationFramePromise())
      .then(_ => {
        this._images.forEach(img => img.style.transform = '');
        return transitionEndPromise(this);
      }) 
      .then(_ => this._images.forEach(img => img.style.transition = ''));

    event.preventDefault();
    event.stopPropagation();
  }

  updateChildren() {
    this._images = this.querySelectorAll('.carousel__item');
    if (this._images.length <= 0) return;
    for (let i = 0; i < this._images.length; i++) {
      this._images[i].style.left = `${100*(i-this.selected)}%`;
      this._images[i].style.transform = '';
    }
    const last = this._images[this._images.length-1];
    const rect = last.getBoundingClientRect();
    this._width = rect.width;
  }
});