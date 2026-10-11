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
  const cards = [...gallery.querySelectorAll('.work-card')];
  const controls = document.querySelector('.work-controls');
  const prev = document.querySelector('[data-work-prev]'), next = document.querySelector('[data-work-next]'), count = document.querySelector('[data-work-count]');
  const mobile = matchMedia('(max-width: 700px)'); let current = 0;
  const update = () => {
    controls.hidden = !mobile.matches;
    if (!mobile.matches) return;
    const rect=gallery.getBoundingClientRect(), rtl=document.documentElement.dir==='rtl';
    const distances=cards.map(c=>Math.abs((rtl?c.getBoundingClientRect().right:c.getBoundingClientRect().left)-(rtl?rect.right:rect.left)));
    current=distances.indexOf(Math.min(...distances));
    const value=`${current+1} / ${cards.length}`;if(count.textContent!==value)count.textContent=value;
    prev.disabled=current===0;next.disabled=current===cards.length-1;
  };
  const go=i=>cards[Math.max(0,Math.min(cards.length-1,i))].scrollIntoView({block:'nearest',inline:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
  gallery.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  new MutationObserver(()=>{if(mobile.matches)go(current);update();}).observe(document.documentElement,{attributes:true,attributeFilter:['dir']});update();
})();
