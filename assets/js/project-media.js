/* Add final screenshots here. Cover images are shown on both the project card and detail page. */
window.PORTFOLIO_PROJECT_MEDIA = {
  budgie: { cover: null, gallery: [] },
  gareeb: { cover: null, gallery: [] },
  qamareya: { cover: null, gallery: [] },
  'day-diamond': { cover: null, gallery: [] }
};
// Example gallery entry: { src: '/assets/images/my-screen.webp', alt: 'Screen description', caption: 'Optional caption' }
(() => {
  Object.entries(window.PORTFOLIO_PROJECT_MEDIA).forEach(([slug, media]) => {
    if (media.cover) {
      const targets=[document.querySelector(`[data-case-cover="${slug}"]`),document.querySelector(`.work-card[href="/projects/${slug}/"] .work-image`)].filter(Boolean);
      targets.forEach(target=>{
        const image=document.createElement('img');image.src=media.cover;image.alt=slug+' project artwork';image.decoding='async';
        target.replaceChildren(image);
      });
    }
    const container=document.querySelector(`[data-project-extra="${slug}"]`);
    if (!container) return;
    media.gallery.forEach(item=>{
      const figure=document.createElement('figure'),image=document.createElement('img');image.src=item.src;image.alt=item.alt || '';image.loading='lazy';image.decoding='async';figure.append(image);
      if(item.caption){const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(caption);}
      container.append(figure);
    });
  });
})();
