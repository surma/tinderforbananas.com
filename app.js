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
    },
    {
      name: 'Banan',
      age: 21,
      job: 'Finnland',
      image: 'testpic3.jpg'
    }
  ];

  const dataProvider = (function* () {
    while (true) {
      yield *items;
    }
  })();

  function adjustNextItem() {
    const top = document.querySelector('.item--top');
    const next = document.querySelector('.item--next');
    const topR = top.getBoundingClientRect();
    next.classList.remove('hidden');
    next.style.top = `${topR.top}px`;
    next.style.width = `${topR.width}px`;
    next.style.height = `${topR.height}px`;
  }

  function updateCards() {
    const top = document.querySelector('.item--top');
    const next = document.querySelector('.item--next');
    top.style.transform = '';
    top.data = next.data;
    next.data = dataProvider.next().value;
  }

  function hookupButtons() {
    document.querySelector('.control--like').addEventListener('click', _ => {
      document.querySelector('.item--top').like();
    });
    document.querySelector('.control--nope').addEventListener('click', _ => {
      document.querySelector('.item--top').nope();
    });
    document.querySelector('.control--superlike').addEventListener('click', _ => {
      document.querySelector('.item--top').superlike();
    });
  }

  function showDetails(event) {
    const swipelist = document.querySelector('.view--swipelist');
    const details = document.querySelector('.view--details');
    const carousel = document.querySelector('tinderforbananas-carousel');
    const image = document.querySelector('.view--swipelist .item--top picture');
    details.querySelector('tinderforbananas-details').data = swipelist.querySelector('.item--top').data;

    // Let’s do FLIP!
    const start = image.getBoundingClientRect();
    
    swipelist.classList.add('hidden');
    details.classList.remove('hidden');

    const target = carousel.getBoundingClientRect();
    carousel.style.transformOrigin = 'top left';
    carousel.style.transform = `scaleX(${start.width/target.width}) scaleY(${start.height/target.height}) translate(${start.left - target.left}px, ${start.top - target.top}px)`;   
    requestAnimationFramePromise()
      .then(_ => requestAnimationFramePromise())
      .then(_ => {
        carousel.style.transition = 'transform 0.15s ease-in-out';
        carousel.style.transform = 'initial';
        return transitionEndPromise(carousel);
      })
      .then(_ => {
        carousel.style.transform = '';
        carousel.style.transition = '';
        carousel.style.transformOrigin = '';
      });

  }

  function hideDetails(event) {
    const swipelist = document.querySelector('.view--swipelist');
    const details = document.querySelector('.view--details');
    const carousel = document.querySelector('tinderforbananas-carousel');
    const item = document.querySelector('.view--swipelist .item--top');
    const image = document.querySelector('.view--swipelist .item--top picture');

    const start = carousel.getBoundingClientRect();

    swipelist.classList.remove('hidden');
    details.classList.add('hidden');

    const target = image.getBoundingClientRect();
    item.style.overflow = 'visible';
    image.style.transformOrigin = 'top left';
    image.style.transform = `scaleX(${start.width/target.width}) scaleY(${start.height/target.height}) translate(${start.left - target.left}px, ${start.top - target.top}px)`;   
    requestAnimationFramePromise()
      .then(_ => requestAnimationFramePromise())
      .then(_ => {
        image.style.transition = 'transform 0.15s ease-in-out';
        image.style.transform = 'initial';
        return transitionEndPromise(image);
      })
      .then(_ => {
        image.style.transform = '';
        image.style.transition = '';
        image.style.transformOrigin = '';
        item.style.overflow = 'hidden';
      });
  }

  function copyControls() {
    document.querySelectorAll('.view--details .control').forEach(btn => {
      const actionName = Array.from(btn.classList).find(name => /(like|nope)/.test(name));
      const svg = document.querySelector(`.view--swipelist .${actionName} svg`).cloneNode(true);
      btn.appendChild(svg);
    });
  }

  function init() {
    const top = document.querySelector('.item--top');
    top.data = dataProvider.next().value;
    top.addEventListener('swipe', updateCards);
    top.addEventListener('details', showDetails);
    const next = document.querySelector('.item--next');
    next.data = dataProvider.next().value;
    const details = document.querySelector('tinderforbananas-details');
    details.addEventListener('dismiss', hideDetails);
    copyControls();
    adjustNextItem();
    window.addEventListener('resize', adjustNextItem);
    hookupButtons();
  }
  init();
})();