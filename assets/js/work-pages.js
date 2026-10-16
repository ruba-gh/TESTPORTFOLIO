(() => {
 document.querySelectorAll('[data-work-pages]').forEach(root=>{
  const track=root.querySelector('[data-work-track]'),tabs=[...root.querySelectorAll('[data-work-tab]')],panels=[...root.querySelectorAll('[data-work-panel]')];
  let current=0,frame=0,programmed=false,settleTimer;
  const select=index=>{
   current=index;
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
   panels.forEach((panel,i)=>{panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));});
  };
  const go=(index,instant=false)=>{
   index=Math.max(0,Math.min(panels.length-1,index));select(index);
   const delta=panels[index].getBoundingClientRect().left-track.getBoundingClientRect().left;
   programmed=Math.abs(delta)>1;
   track.scrollBy({left:delta,behavior:instant||matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>go(i)));
  const keyboard=event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   if(event.target!==track&&!event.target.closest('[data-work-tab]'))return;
   event.preventDefault();const rtl=document.documentElement.dir==='rtl';
   const next=event.key==='Home'?0:event.key==='End'?panels.length-1:current+(event.key==='ArrowRight'?1:-1)*(rtl?-1:1);
   go(next);if(event.target!==track)tabs[current].focus();
  };
  root.addEventListener('keydown',keyboard);
  const update=()=>{
   cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const edge=track.getBoundingClientRect().left;
    const distances=panels.map(panel=>Math.abs(panel.getBoundingClientRect().left-edge));
    select(distances.indexOf(Math.min(...distances)));
   });
  };
  track.addEventListener('scroll',()=>{
   if(!programmed)update();
   clearTimeout(settleTimer);settleTimer=setTimeout(()=>{programmed=false;update();},150);
  },{passive:true});
  ['pointerdown','wheel','touchstart'].forEach(type=>track.addEventListener(type,()=>{programmed=false;},{passive:true}));
  const realign=()=>{const index=current;requestAnimationFrame(()=>go(index,true));};
  window.addEventListener('resize',realign);
  document.addEventListener('portfolio-language-change',realign);
  select(0);
 });
})();
