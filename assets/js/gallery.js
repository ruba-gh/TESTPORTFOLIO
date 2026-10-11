(() => {
  const art = window.PORTFOLIO_ARTWORK;
  if (art) {
    document.querySelectorAll('.brand img').forEach(img => img.src = art.logo);
    Object.entries(art.icons).forEach(([key, path]) => {
      document.querySelectorAll(`img[src="/assets/illustrations/icon-${key}.svg"]`).forEach(img => img.src = path);
    });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const updateTelephone = () => document.querySelectorAll('.telephone-art').forEach(img => {
      img.src = reduced.matches ? art.telephoneStill : art.telephone;
      img.classList.toggle('custom-animated', /\.gif(?:[?#]|$)/i.test(art.telephone));
    });
    reduced.addEventListener('change', updateTelephone);
    updateTelephone();
    Object.entries(art.projectArtwork).forEach(([slug, path]) => {
      const placeholder = document.querySelector(`.concept-art.${CSS.escape(slug)}`);
      if (!placeholder) return;
      const img = document.createElement('img');
      img.src = path; img.alt = placeholder.getAttribute('aria-label').replace(/ illustration placeholder$/, ' artwork');
      img.decoding = 'async'; placeholder.replaceWith(img);
    });
  }
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.pathname === location.pathname || (link.pathname === '/' && location.pathname === '/projects/')) link.setAttribute('aria-current', 'page');
  });
  const aboutTabs = document.querySelector('.about-tabs');
  if (aboutTabs) {
    const tabs = [...aboutTabs.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    const smallScreen = matchMedia('(max-width: 700px)');
    let selected = 0;
    const updateAbout = () => {
      aboutTabs.hidden = !smallScreen.matches;
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === selected));
        tab.tabIndex = i === selected ? 0 : -1;
        panels[i].hidden = smallScreen.matches && i !== selected;
        if (smallScreen.matches) {
          panels[i].setAttribute('role','tabpanel');
          panels[i].setAttribute('aria-labelledby',tab.id);
          panels[i].tabIndex = 0;
        } else {
          panels[i].removeAttribute('role');
          panels[i].setAttribute('aria-labelledby', i === 0 ? 'background-title' : 'services-title');
          panels[i].removeAttribute('tabindex');
        }
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => { selected = i; updateAbout(); });
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        selected = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + 1) % tabs.length;
        updateAbout(); tabs[selected].focus();
      });
    });
    smallScreen.addEventListener('change', updateAbout);
    updateAbout();
  }
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;
  const paintings = [...gallery.querySelectorAll('.painting')];
  // Shuffle a balanced set once per browser tab; avoid reshuffling while browsing.
  let frames;
  try { frames = JSON.parse(sessionStorage.getItem('ruba-gallery-frames')); } catch (_) {}
  if (!Array.isArray(frames) || frames.length !== paintings.length || frames.some(n => ![1,2,3].includes(n))) {
    frames = paintings.map((_, i) => i % 3 + 1);
    for (let i = frames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [frames[i], frames[j]] = [frames[j], frames[i]];
    }
    try { sessionStorage.setItem('ruba-gallery-frames', JSON.stringify(frames)); } catch (_) {}
  }
  paintings.forEach((painting, i) => painting.querySelector('.painting-frame').src = art?.frames[frames[i] - 1] || `/assets/illustrations/frame-0${frames[i]}.svg`);
  const controls = document.querySelector('.gallery-controls');
  const prev = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  const count = document.querySelector('[data-gallery-count]');
  const mobile = matchMedia('(max-width: 700px)');
  let current = 0;
  const update = () => {
    controls.hidden = !mobile.matches;
    if (!mobile.matches) return;
    const rect = gallery.getBoundingClientRect();
    const rtl = document.documentElement.dir === 'rtl';
    const edge = rtl ? rect.right : rect.left;
    const distances = paintings.map(p => Math.abs((rtl ? p.getBoundingClientRect().right : p.getBoundingClientRect().left) - edge));
    current = distances.indexOf(Math.min(...distances));
    const value = `${current + 1} / ${paintings.length}`;
    if (count.textContent !== value) count.textContent = value;
    prev.disabled = current === 0;
    next.disabled = current === paintings.length - 1;
  };
  const go = index => paintings[Math.max(0, Math.min(paintings.length - 1, index))].scrollIntoView({block:'nearest', inline:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  gallery.addEventListener('scroll', update, {passive:true});
  mobile.addEventListener('change', update);
  window.addEventListener('resize', update);
  new MutationObserver(() => { if (mobile.matches) go(current); update(); }).observe(document.documentElement, {attributes:true, attributeFilter:['dir']});
  update();
})();
