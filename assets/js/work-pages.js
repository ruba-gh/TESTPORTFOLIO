(() => {
 document.querySelectorAll('[data-work-pages]').forEach(root=>{
  const track=root.querySelector('[data-work-track]'),tabs=[...root.querySelectorAll('[data-work-tab]')],panels=[...root.querySelectorAll('[data-work-panel]')];
  let current=0,touch;
  const select=index=>{
   current=Math.max(0,Math.min(panels.length-1,index));
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
   panels.forEach((panel,i)=>{panel.hidden=i!==current;panel.inert=i!==current;panel.setAttribute('aria-hidden',String(i!==current));});
   document.dispatchEvent(new Event('portfolio-work-change'));
  };
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>select(i)));
  root.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   if(event.target!==track&&!event.target.closest('[data-work-tab]'))return;
   event.preventDefault();
   const rtl=document.documentElement.dir==='rtl';
   select(event.key==='Home'?0:event.key==='End'?panels.length-1:current+(event.key==='ArrowRight'?1:-1)*(rtl?-1:1));
   if(event.target!==track)tabs[current].focus();
  });
  track.addEventListener('touchstart',event=>{const p=event.touches[0];touch={x:p.clientX,y:p.clientY};},{passive:true});
  track.addEventListener('touchend',event=>{
   if(!touch)return;
   const p=event.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y;touch=null;
   if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy))return;
   select(current+(dx<0?1:-1)*(document.documentElement.dir==='rtl'?-1:1));
  },{passive:true});
  track.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  // Always start with Apps; locale and viewport changes never select a different tab.
  select(0);
 });
})();
