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

  const dataProvider = (function* () {
    while (true) {
      yield *items;
    }
  })();

  function adjustNextItem() {
    const top = document.querySelector('.item--top');
    const next = document.querySelector('.item--next');
    const topR = top.getBoundingClientRect();
    next.classList.remove('item--invisible');
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

  function init() {
    const top = document.querySelector('.item--top');
    top.data = dataProvider.next().value;
    const next = document.querySelector('.item--next');
    next.data = dataProvider.next().value;
    top.addEventListener('swipe', updateCards);
    adjustNextItem();
    window.addEventListener('resize', adjustNextItem);
    hookupButtons();
  }
  init();
})();