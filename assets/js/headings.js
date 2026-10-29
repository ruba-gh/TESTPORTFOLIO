(() => {
 const headings=[...document.querySelectorAll('.atmo-site h1,.atmo-site h2,.atmo-site h3')];
 let frame;
 function fit(){
  for(const heading of headings){
   heading.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
   heading.style.fontSize='';
   let size=parseFloat(getComputedStyle(heading).fontSize);
   const available=heading.clientWidth;
   // Font hinting can make a proportional first pass a few pixels too wide.
   for(let pass=0;available && heading.scrollWidth>available && pass<6;pass++){
    size=Math.floor(size*available/heading.scrollWidth*.98*100)/100;
    heading.style.fontSize=`${size}px`;
   }
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
