(function () {
  const items = [
    {
      name: 'Saba',
      age: 25,
      job: 'Phillippines',
      image: 'testpic1.jpg'
    },
    {
      name: 'Plantain',
      age: 28,
      job: 'Nicaragua',
      image: 'testpic2.jpg'
    }
  ];
  var currentItem = items[0];
  var nextItem = items[1];

  var dragging = false;
  var startX = 0;
  var startY = 0;
  function startDrag(event) {
    dragging = true;
    startX = event.clientX || event.touches[0].clientX;
    startY = event.clientY || event.touches[0].clientY;
    event.preventDefault();
  }
  function stopDrag(event) {
    if (!dragging) return;
    dragging = false;
    const deltaX = (event.clientX || event.changedTouches[0].clientX) - startX;
    const deltaY = (event.clientY || event.changedTouches[0].clientY) - startY;

    const p = (_ => {
      if (deltaX < -this.gBCR.width / 2) return nope(this);
      if (deltaX > this.gBCR.width / 2) return like(this);
      if (deltaY < -this.gBCR.height / 2) return superlike(this);
      return animateItem(this, 'initial');
    })();

    this.querySelectorAll('.action').forEach(a => a.style.opacity = 0);
    event.preventDefault();
  }
  function drag(event) {
    if (!dragging) return;

    const deltaX = (event.clientX || event.touches[0].clientX) - startX;
    const deltaY = (event.clientY || event.touches[0].clientY) - startY;

    this.style.transform = `rotate(${(deltaX) / this.gBCR.width * 15}deg) translate(${deltaX}px, ${deltaY}px)`;
    this.querySelector('.action--nope').style.opacity = (-deltaX - this.gBCR.width / 5) / (this.gBCR.width / 3);
    this.querySelector('.action--like').style.opacity = ( deltaX - this.gBCR.width / 5) / (this.gBCR.width / 3);
    this.querySelector('.action--superlike').style.opacity = (-deltaY - this.gBCR.height / 5) / (this.gBCR.height / 3);
    event.preventDefault();
  }
  function animateItem(item, target, opts = {}) {
    return new Promise(resolve => {
      item.style.transition = 'transform 0.3s ease-in-out';
      requestAnimationFrame(_ => {
        item.style.transform = target;
        item.addEventListener('transitionend', _ => {
          if (opts.next) {
            [currentItem, nextItem] = [nextItem, items[Math.floor(Math.random()*items.length)]];
            updateCards();
          }
          item.style.transition = 'initial';
          item.style.transform = 'initial';
          resolve();
        }, {once: true});
      });
    });
  }
  function like(item) {
    return animateItem(item, `translateX(200%)`, {next: true});
  }
  function nope(item) {
    return animateItem(item, `translateX(-200%)`, {next: true});
  }
  function superlike(item) {
    return animateItem(item, `translateY(-200%)`, {next: true});
  }
  function updateCards() {
    const top = document.querySelector('.item--top');
    top.querySelector('.item__details__name').textContent = `${currentItem.name},`;
    top.querySelector('.item__details__age').textContent = `${currentItem.age}`;
    top.querySelector('.item__details__job').textContent = `${currentItem.job}`;
    top.querySelector('picture').style.backgroundImage = `url('${currentItem.image}')`;

    const next = document.querySelector('.item--next');
    next.querySelector('.item__details__name').textContent = `${nextItem.name},`;
    next.querySelector('.item__details__age').textContent = `${nextItem.age}`;
    next.querySelector('.item__details__job').textContent = `${nextItem.job}`;
    next.querySelector('picture').style.backgroundImage = `url('${nextItem.image}')`;
  }
  function makeDraggable() {
    const item = document.querySelector('.item--top');
    item.gBCR = item.getBoundingClientRect();
    item.addEventListener('mousedown', startDrag.bind(item));
    document.addEventListener('mouseup', stopDrag.bind(item)); 
    document.addEventListener('mousemove', drag.bind(item)); 
    item.addEventListener('touchstart', startDrag.bind(item));
    document.addEventListener('touchend', stopDrag.bind(item)); 
    document.addEventListener('touchmove', drag.bind(item)); 
  }
  function adjustNextItem() {
    const top = document.querySelector('.item--top');
    const next = document.querySelector('.item--next');
    const topR = top.getBoundingClientRect();
    next.classList.remove('item--invisible');
    next.style.width = `${topR.width}px`;
    next.style.height = `${topR.height}px`;
  }
  function hookupButtons() {
    document.querySelector('.control--like').addEventListener('click', _ => {
      like(document.querySelector('.item--top'));
    });
    document.querySelector('.control--nope').addEventListener('click', _ => {
      nope(document.querySelector('.item--top'));
    });
    document.querySelector('.control--superlike').addEventListener('click', _ => {
      superlike(document.querySelector('.item--top'));
    });
  }
  function init() {
    updateCards();
    adjustNextItem();
    window.addEventListener('resize', adjustNextItem);
    makeDraggable();
    hookupButtons();
  }
  init();
})();