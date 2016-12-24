window.requestAnimationFramePromise = _ => new Promise(requestAnimationFrame);
window.transitionEndPromise = elem => new Promise(resolve => {
  elem.addEventListener('transitionend', resolve, {once: true});
});