// If a supplied image fails, restore the accessible ALT slot instead of a broken icon.
document.querySelectorAll('[data-asset] img').forEach(image=>{
 const fallback=()=>{const slot=image.parentElement;slot.setAttribute('aria-label',image.alt);const label=document.createElement('span');label.className='atmo-alt';label.setAttribute('aria-hidden','true');label.textContent='ALT';image.replaceWith(label);};
 image.addEventListener('error',fallback,{once:true});if(image.complete&&!image.naturalWidth)fallback();
});
