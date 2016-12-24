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
    console.log('showing details')
    const swipelist = document.querySelector('.view--swipelist');
    const details = document.querySelector('.view--details');
    details.data = top.data;
    requestAnimationFramePromise()
      .then(_ => {
        swipelist.classList.add('hidden');
        details.classList.remove('hidden');
        for(var i = 0; i < 1000; i++)
          details.querySelector('tinderforbananas-details').textContent += 'asdfasdfasdf ';
      })
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
    const next = document.querySelector('.item--next');
    next.data = dataProvider.next().value;
    top.addEventListener('swipe', updateCards);
    top.addEventListener('details', showDetails);
    copyControls();
    adjustNextItem();
    window.addEventListener('resize', adjustNextItem);
    hookupButtons();
  }
  init();
})();