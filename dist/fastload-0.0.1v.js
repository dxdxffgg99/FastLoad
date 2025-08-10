/*! FastLoad v0.0.1 — single-tag bundle (CSS+JS) */
(function () {
  const S = document.currentScript;
  const CFG = {
    debug: (S?.dataset.debug ?? 'false') === 'true',
    idleTimeout: parseInt(S?.dataset.idleTimeout ?? '1800', 10)
  };
  const log = (...a) => CFG.debug && console.log('[FastLoad]', ...a);

  const CSS = 'html[data-fl-init] body :not([data-fastload="true"]){visibility:hidden!important}';
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  (document.head || document.documentElement).appendChild(styleEl);
  document.documentElement.setAttribute('data-fl-init','');

  const revealAll = () => {
    document.documentElement.removeAttribute('data-fl-init');
    document.querySelectorAll('[data-fl-inert]').forEach(el => el.removeAttribute('inert'));
    log('released non-fast content');
  };

  const eagerBoost = (root) => {
    root.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority','high');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    });
  };

  const holdNonFast = () => {
    document.querySelectorAll('body :not([data-fastload="true"])').forEach(el => {
      el.setAttribute('inert','');
      el.setAttribute('data-fl-inert','');
    });
  };

  const releaseWhenIdle = () => {
    const idle = window.requestIdleCallback || ((fn,o)=>setTimeout(fn, o?.timeout||1200));
    let released = false;
    const release = () => { if (!released) { released = true; revealAll(); } };
    ['scroll','pointerdown','keydown'].forEach(ev =>
      window.addEventListener(ev, release, { once:true, passive:true })
    );
    window.addEventListener('load', release, { once:true });
    idle(release, { timeout: CFG.idleTimeout });
  };

  function init() {
    document.querySelectorAll('[data-fastload="true"]').forEach(eagerBoost);
    holdNonFast();
    releaseWhenIdle();
    window.FastLoad = { debug: CFG.debug, release: revealAll, boost: eagerBoost };
    log('init done. fast blocks:', document.querySelectorAll('[data-fastload="true"]').length, 'cfg:', CFG);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else { init(); }
})();
