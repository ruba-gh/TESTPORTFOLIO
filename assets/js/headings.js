(() => {
 const headings=[...document.querySelectorAll('.atmo-site h1,.atmo-site h2,.atmo-site h3')];
 let frame;
 function fit(){
  for(const heading of headings){
   heading.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
   heading.style.fontSize='';
   const size=parseFloat(getComputedStyle(heading).fontSize);
   const available=heading.clientWidth;
   if(available && heading.scrollWidth>available)heading.style.fontSize=`${Math.floor(size*available/heading.scrollWidth*100)/100}px`;
  }
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(fit);}
 const observer=new ResizeObserver(schedule);
 for(const heading of headings)if(heading.parentElement)observer.observe(heading.parentElement);
 document.addEventListener('portfolio-language-change',()=>{schedule();document.fonts.ready.then(schedule);});
 window.addEventListener('resize',schedule);
 document.fonts.ready.then(schedule);
 schedule();
})();
