(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Effect 1 — inject ambient aurora once */
  if (!document.querySelector('.fx-aurora')) {
    const aurora = document.createElement('div');
    aurora.className = 'fx-aurora';
    aurora.innerHTML = '<i></i><i></i><i></i>';
    document.body.prepend(aurora);
  }

  /* Effects 2/3/5/6/7/8 — tag live elements with brand-new fx-* classes.
     Purely additive: never removes or rewrites existing classes/markup. */
  const TAG_MAP = [
    ['.card,.kpi,.oi-card,.oi-kpi,.table-card,.command-strip>div,.train-item,.device-card,.capx-panel', 'fx-glass fx-ring fx-enter'],
    ['.kpi strong,.oi-kpi b', 'fx-shimmer-text'],
    ['.btn,.icon-btn,.oi-btn', 'fx-glow-btn'],
    ['.pulse,.live-dot,.oi-live i', 'fx-radar'],
    ['input,select,textarea', 'fx-focus'],
  ];

  const tag = (root) => {
    TAG_MAP.forEach(([sel, classes]) => {
      root.querySelectorAll(sel).forEach(el => el.classList.add(...classes.split(' ')));
    });
  };
  tag(document);

  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { tag(document); pending = false; });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  /* Effect 3 — mouse-tracked spotlight, delegated so it survives every redraw */
  if (!reduced) {
    document.addEventListener('pointermove', e => {
      const card = e.target.closest('.fx-ring');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--fx-mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty('--fx-my', `${((e.clientY - r.top) / r.height) * 100}%`);
    }, { passive: true });
  }
})();
