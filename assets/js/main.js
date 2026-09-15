(() => {
  const LOCALES = window.PORTFOLIO_LOCALES || {};
  const storageKey = 'ruba-portfolio-language';
  const defaultLang = 'en';
  const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
  const getLang = () => {
    const saved = localStorage.getItem(storageKey);
    return saved === 'ar' || saved === 'en' ? saved : defaultLang;
  };
  const t = (value, lang = getLang()) => {
    const key = normalize(value);
    return (LOCALES[lang] && LOCALES[lang][key]) || (LOCALES.en && LOCALES.en[key]) || value;
  };

  let baseTextNodes = [];
  let baseAttrs = [];
  let baseMeta = [];

  function captureTranslatableContent() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      baseTextNodes.push({node, value: normalize(node.nodeValue)});
    }
    document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el => {
      ['aria-label','title','placeholder'].forEach(attr => {
        if (el.hasAttribute(attr)) baseAttrs.push({el, attr, value: normalize(el.getAttribute(attr))});
      });
    });
    document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(el => {
      baseMeta.push({el, value: normalize(el.content)});
    });
  }

  function setLanguage(lang) {
    if (!LOCALES[lang]) lang = defaultLang;
    localStorage.setItem(storageKey, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', lang === 'ar');

    baseTextNodes.forEach(({node, value}) => {
      const translated = t(value, lang);
      if (translated !== undefined) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translated);
    });
    baseAttrs.forEach(({el, attr, value}) => el.setAttribute(attr, t(value, lang)));
    baseMeta.forEach(({el, value}) => { el.content = t(value, lang); });
    const baseTitle = document.documentElement.dataset.baseTitle || normalize(document.title);
    document.documentElement.dataset.baseTitle = baseTitle;
    document.title = t(baseTitle, lang);

    document.querySelectorAll('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

    const form = document.querySelector('[data-contact-form]');
    if (form) setupValidationMessages(form, lang);
  }

  function setupValidationMessages(form, lang) {
    const rules = {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      'project-type': 'Please enter the project type.',
      message: 'Please enter a message.',
      consent: 'Please confirm the consent checkbox.'
    };
    Object.entries(rules).forEach(([id, message]) => {
      const field = form.querySelector('#' + CSS.escape(id));
      if (!field) return;
      field.addEventListener('invalid', () => field.setCustomValidity(t(message, lang)), {once:true});
      field.addEventListener('input', () => field.setCustomValidity(''));
      field.addEventListener('change', () => field.setCustomValidity(''));
    });
  }

  function initLanguageSwitchers() {
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.addEventListener('click', () => setLanguage(button.dataset.lang));
    });
  }

  function initDrawer() {
    const toggle = document.querySelector('.menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('[data-drawer-overlay]');
    const closeButton = document.querySelector('.drawer-close');
    if (!toggle || !drawer || !overlay || !closeButton) return;
    let previousFocus = null;

    const focusable = () => [...drawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')];
    const open = () => {
      previousFocus = document.activeElement;
      drawer.classList.add('open');
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('show'));
      drawer.setAttribute('aria-hidden','false');
      toggle.setAttribute('aria-expanded','true');
      document.body.classList.add('drawer-open');
      (focusable()[0] || drawer).focus();
    };
    const close = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      drawer.setAttribute('aria-hidden','true');
      toggle.setAttribute('aria-expanded','false');
      document.body.classList.remove('drawer-open');
      window.setTimeout(() => { overlay.hidden = true; }, 180);
      if (previousFocus) previousFocus.focus();
    };
    toggle.addEventListener('click', open);
    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', close);
    drawer.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (!drawer.classList.contains('open')) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === 'Tab') {
        const items = focusable();
        if (!items.length) return;
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function initHeroVideo() {
    const video = document.querySelector('[data-hero-video]');
    if (!video) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 680px)').matches;
    if (reduced || mobile) return;
    video.querySelectorAll('source[data-src]').forEach(source => source.src = source.dataset.src);
    video.load();
    const play = () => video.play().catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(play, {timeout:1200}); else setTimeout(play, 350);
  }

  function initScrollReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.statement .shell, .section-head, .project-card, .about-grid, .capability, .contact-strip .shell, .case-section-grid, .full-media');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, {threshold: 0, rootMargin: '0px 0px -32px 0px'});
    targets.forEach(target => {
      // Keep initially visible content readable immediately.
      if (target.getBoundingClientRect().top < window.innerHeight) return;
      target.classList.add('reveal-pending');
      observer.observe(target);
    });
    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;
      observer.disconnect();
      targets.forEach(target => target.classList.add('is-visible'));
    });
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    const success = document.querySelector('#form-success');
    const error = document.querySelector('#form-error');
    form.addEventListener('submit', async (event) => {
      if (!form.checkValidity()) return;
      event.preventDefault();
      success.classList.remove('show'); error.classList.remove('show');
      const currentLabel = normalize(button.textContent);
      button.disabled = true; button.textContent = t('Sending…'); button.setAttribute('aria-busy','true');
      const data = new URLSearchParams(new FormData(form));
      try {
        const response = await fetch('/', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data.toString()});
        if (!response.ok) throw new Error('Submission failed');
        form.reset(); success.classList.add('show'); success.focus();
      } catch (_) {
        error.classList.add('show'); error.focus();
      } finally {
        button.disabled=false; button.textContent=currentLabel; button.removeAttribute('aria-busy');
      }
    });
  }

  initScrollReveal();
  captureTranslatableContent();
  initLanguageSwitchers();
  initDrawer();
  setLanguage(getLang());
  initHeroVideo();
  initContactForm();
})();
