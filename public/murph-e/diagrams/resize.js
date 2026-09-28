(() => {
  const root = document.getElementById(document.currentScript.dataset.root);
  let frame = 0, suspended = false, disposed = false;
  const measure = () => {
    if (frame || suspended || disposed) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!suspended && !disposed) parent.postMessage({ type: 'murphe-diagram-height', height: Math.ceil(root.getBoundingClientRect().height) }, '*');
    });
  };
  const observer = new ResizeObserver(measure);
  const connect = () => {
    observer.observe(root);
    window.addEventListener('resize', measure);
    measure();
  };
  const hide = (event) => {
    suspended = true;
    observer.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener('resize', measure);
    if (!event.persisted) {
      disposed = true;
      window.removeEventListener('pagehide', hide);
      window.removeEventListener('pageshow', show);
    }
  };
  const show = (event) => {
    if (!event.persisted || disposed) return;
    suspended = false;
    connect();
  };
  window.addEventListener('pagehide', hide);
  window.addEventListener('pageshow', show);
  document.fonts.ready.then(measure);
  connect();
})();
