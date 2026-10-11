(() => {
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.pathname === location.pathname || (link.pathname === '/projects/' && (location.pathname === '/' || location.pathname.startsWith('/projects/')))) link.setAttribute('aria-current','page');
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

  const story=document.querySelector('.project-story');
  if(story){const narrow=matchMedia('(max-width: 700px)');story.open=!narrow.matches;narrow.addEventListener('change',()=>story.open=!narrow.matches);}
  const gallery = document.querySelector('[data-work-gallery]');
  if (!gallery) return;
  const allCards = [...gallery.querySelectorAll('.work-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const filterBar = document.querySelector('.work-filters');
  const empty = document.querySelector('.empty-projects');
  const filterStatus = document.querySelector('[data-filter-status]');
  const controls = document.querySelector('.work-controls');
  const prev = document.querySelector('[data-work-prev]'), next = document.querySelector('[data-work-next]'), count = document.querySelector('[data-work-count]');
  const mobile = matchMedia('(max-width: 700px)');
  const t = value => window.PORTFOLIO_I18N?.t(value) || value;
  const categories = ['ux-ui','design','websites'];
  let selected = new URL(location.href).searchParams.get('category');
  if (!categories.includes(selected)) selected = 'ux-ui';
  let current = 0;
  const visibleCards = () => allCards.filter(card => !card.hidden);
  const update = () => {
    const cards = visibleCards();
    controls.hidden = !mobile.matches || cards.length < 2;
    if (!cards.length) return;
    const rect = gallery.getBoundingClientRect(), rtl = document.documentElement.dir === 'rtl';
    const distances = cards.map(card => Math.abs((rtl ? card.getBoundingClientRect().right : card.getBoundingClientRect().left) - (rtl ? rect.right : rect.left)));
    current = distances.indexOf(Math.min(...distances));
    const value = `${current + 1} / ${cards.length}`;
    if (count.textContent !== value) count.textContent = value;
    prev.disabled = current === 0; next.disabled = current === cards.length - 1;
  };
  const go = index => {
    const cards = visibleCards(); if (!cards.length) return;
    cards[Math.max(0,Math.min(cards.length-1,index))].scrollIntoView({block:'nearest',inline:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  const applyFilter = (announce = false) => {
    filters.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === selected)));
    allCards.forEach(card => card.hidden = !card.dataset.category.split(/\s+/).includes(selected));
    const cards = visibleCards();
    empty.hidden = cards.length > 0;
    gallery.hidden = !cards.length;
    if (!cards.length) {
      empty.querySelector('[data-empty-title]').textContent = t(selected === 'design' ? 'Brand design, coming soon.' : 'Websites, coming soon.');
      empty.querySelector('[data-empty-copy]').textContent = t(selected === 'design' ? 'A space for visual identities, logos and brand illustrations.' : 'A space for landing pages and website projects.');
    }
    current = 0; gallery.scrollLeft = 0; update();
    if (announce) filterStatus.textContent = `${cards.length} ${t('projects shown')}`;
  };
  filterBar.hidden = false;
  filters.forEach((button,index) => {
    button.addEventListener('click',() => {
      selected = button.dataset.filter;
      const url = new URL(location.href); url.searchParams.set('category',selected);
      history.replaceState(null,'',url); applyFilter(true);
    });
    button.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const rtl = document.documentElement.dir === 'rtl';
      const step = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? filters.length-1 : (index+step+filters.length)%filters.length;
      filters[nextIndex].focus();
    });
  });
  prev.addEventListener('click',()=>go(current-1)); next.addEventListener('click',()=>go(current+1));
  gallery.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update);
  window.addEventListener('popstate',()=>{selected=new URL(location.href).searchParams.get('category');if(!categories.includes(selected))selected='ux-ui';applyFilter();});
  document.addEventListener('portfolio-language-change',()=>{if(!visibleCards().length)applyFilter();});
  new MutationObserver(()=>{if(mobile.matches)go(current);update();}).observe(document.documentElement,{attributes:true,attributeFilter:['dir']});
  applyFilter();
})();
