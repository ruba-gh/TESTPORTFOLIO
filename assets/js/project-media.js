/* Add images here. The existing cover is slide one; gallery entries become additional slides. */
window.PORTFOLIO_PROJECT_MEDIA = {
  budgie: { cover: null, gallery: [
    { placeholder: 'Research & process', caption: 'Add your process images here.' },
    { placeholder: 'Interface details', caption: 'Add final screens and close-ups here.' }
  ] },
  gareeb: { cover: null, gallery: [
    { src: '/assets/images/gareeb-ui-1920.webp', alt: 'Gareeb interface screens', caption: 'Interface screens' },
    { placeholder: 'Research & process', caption: 'Add your process images here.' }
  ] },
  qamareya: { cover: null, gallery: [
    { placeholder: 'Research & process', caption: 'Add your process images here.' },
    { placeholder: 'Interface details', caption: 'Add final screens and close-ups here.' }
  ] },
  'day-diamond': { cover: null, gallery: [
    { placeholder: 'Research & process', caption: 'Add your process images here.' },
    { placeholder: 'Interface details', caption: 'Add final screens and close-ups here.' }
  ] }
};
(() => {
  const t = value => window.PORTFOLIO_I18N?.t(value) || value;
  Object.entries(window.PORTFOLIO_PROJECT_MEDIA).forEach(([slug,media]) => {
    if (media.cover) {
      const targets=[document.querySelector(`[data-case-cover="${slug}"]`),document.querySelector(`.work-card[href="/projects/${slug}/"] .work-image`)].filter(Boolean);
      targets.forEach(target=>{const image=document.createElement('img');image.src=media.cover;image.alt=slug+' project artwork';image.decoding='async';target.replaceChildren(image);});
    }
    const carousel=document.querySelector(`[data-case-carousel="${slug}"]`);
    if (!carousel) return;
    const track=carousel.querySelector('[data-case-track]');
    const captions=['Project overview'];
    media.gallery.forEach(item=>{
      const figure=document.createElement('figure'),visual=document.createElement('div'),caption=document.createElement('figcaption');
      figure.className='case-slide';visual.className='slide-visual';
      if(item.src){
        const image=document.createElement('img');image.src=item.src;image.alt=item.alt || '';image.loading='lazy';image.decoding='async';visual.append(image);
      } else {
        const placeholder=document.createElement('div'),heading=document.createElement('h3'),copy=document.createElement('p');placeholder.className='slide-placeholder';heading.dataset.baseText=item.placeholder;copy.dataset.baseText='Image placeholder';heading.textContent=t(item.placeholder);copy.textContent=t('Image placeholder');placeholder.append(heading,copy);visual.append(placeholder);
      }
      captions.push(item.caption || 'Project image');caption.textContent=t(item.caption || 'Project image');figure.append(visual,caption);track.append(figure);
    });
    // Images can be opened at native size without enlarging the default page layout.
    track.querySelectorAll('.slide-visual').forEach(visual=>{
      const image=visual.querySelector('img'); if(!image)return;
      const link=document.createElement('a');link.href=image.src;link.target='_blank';link.rel='noopener';link.setAttribute('aria-label',t('Open image at full size'));
      while(visual.firstChild)link.append(visual.firstChild);visual.append(link);
    });
    const slides=[...track.querySelectorAll('.case-slide')], controls=carousel.querySelector('.case-carousel-controls'), prev=carousel.querySelector('[data-case-prev]'),next=carousel.querySelector('[data-case-next]'),count=carousel.querySelector('[data-case-count]'),dots=carousel.querySelector('[data-case-dots]');
    let current=0;
    const go=index=>{
      const i=Math.max(0,Math.min(slides.length-1,index));
      track.scrollTo({left:slides[i].offsetLeft-slides[0].offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    };
    slides.forEach((_,i)=>{
      const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`${t('Go to image')} ${i+1}`);dot.addEventListener('click',()=>go(i));dots.append(dot);
    });
    const update=()=>{
      const edge=track.getBoundingClientRect().left;
      const distances=slides.map(slide=>Math.abs(slide.getBoundingClientRect().left-edge));
      current=distances.indexOf(Math.min(...distances));
      const label=`${current+1} / ${slides.length}`;if(count.textContent!==label)count.textContent=label;
      prev.disabled=current===0;next.disabled=current===slides.length-1;
      [...dots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));
    };
    controls.hidden=slides.length<2;dots.hidden=slides.length<2;
    prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));track.addEventListener('scroll',update,{passive:true});
    track.addEventListener('keydown',event=>{
      if(event.target!==track || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const rtl=document.documentElement.dir==='rtl';
      go(event.key==='Home'?0:event.key==='End'?slides.length-1:current+((event.key==='ArrowRight')!==rtl?1:-1));
    });
    const localize=()=>{
      slides.forEach((slide,i)=>{slide.querySelector('figcaption').textContent=t(captions[i]);slide.querySelectorAll('[data-base-text]').forEach(el=>el.textContent=t(el.dataset.baseText));});
      track.querySelectorAll('a').forEach(link=>link.setAttribute('aria-label',t('Open image at full size')));
      [...dots.children].forEach((dot,i)=>dot.setAttribute('aria-label',`${t('Go to image')} ${i+1}`));
      update();
    };
    document.addEventListener('portfolio-language-change',localize);
    window.addEventListener('resize',()=>{go(current);update();});localize();
  });
})();
