window.requestAnimationFramePromise = _ => new Promise(requestAnimationFrame);
window.transitionEndPromise = elem => new Promise(resolve => {
  elem.addEventListener('transitionend', resolve, {once: true});
});
window.lerp = (minIn, maxIn, minOut, maxOut, opts = {}) => {
  const rangeIn = maxIn - minIn;
  const rangeOut = maxOut - minOut;
  
  return (v) => {
    v = opts.absolute ? Math.abs(v) : v;
    let p;
    if (opts.noClamp) p = (v - minIn) / rangeIn;
    else p = Math.max(Math.min((v - minIn) / rangeIn, 1), 0);
    return p * rangeOut + minOut;
  };
}