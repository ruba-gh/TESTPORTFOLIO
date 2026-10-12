(() => {
  const dictionaries=window.PORTFOLIO_LOCALES || {};
  const storageKey='ruba-portfolio-language';
  let lang='en';
  try { const saved=localStorage.getItem(storageKey);if(saved==='ar'||saved==='en')lang=saved; } catch (_) {}
  const normalize=value=>String(value||'').replace(/\s+/g,' ').trim();
  const t=(value,language=lang)=>dictionaries[language]?.[normalize(value)] || dictionaries.en?.[normalize(value)] || value;
  const title=document.title;
  const texts=[],attributes=[],metadata=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){
    const parent=node.parentElement;
    return normalize(node.nodeValue) && parent && !parent.closest('script,style,noscript') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
  }});
  let node;
  while((node=walker.nextNode())){
    const value=node.nodeValue,parts=value.match(/^(\s*)(.*?)(\s*)$/s);
    texts.push({node,key:normalize(value),prefix:parts[1],suffix:parts[3]});
  }
  document.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach(element=>{
    ['aria-label','title','placeholder','alt'].forEach(attribute=>{if(element.hasAttribute(attribute))attributes.push({element,attribute,value:element.getAttribute(attribute)});});
  });
  document.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(element=>metadata.push({element,value:element.content}));
  const setLanguage=value=>{
    lang=dictionaries[value]?value:'en';
    try{localStorage.setItem(storageKey,lang);}catch(_){}
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    texts.forEach(({node,key,prefix,suffix})=>{if(node.isConnected)node.nodeValue=prefix+t(key)+suffix;});
    attributes.forEach(({element,attribute,value})=>{if(element.isConnected)element.setAttribute(attribute,t(value));});
    metadata.forEach(({element,value})=>element.content=t(value));
    document.title=t(title);
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
    document.querySelectorAll('[data-year]').forEach(element=>element.textContent=new Date().getFullYear());
    document.dispatchEvent(new CustomEvent('portfolio-language-change',{detail:{lang}}));
  };
  window.PORTFOLIO_I18N={t,getLang:()=>lang};
  document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
  document.querySelectorAll('.nav-links a').forEach(link=>{if(location.pathname===link.pathname || (link.pathname==='/projects/'&&location.pathname.startsWith('/projects/')))link.setAttribute('aria-current','page');});
  setLanguage(lang);
  const form=document.querySelector('[data-contact-form]');
  if(!form)return;
  const messages={name:'Please enter your name.',email:'Please enter a valid email address.','project-type':'Please enter the project type.',message:'Please enter a message.',consent:'Please confirm the consent checkbox.'};
  Object.entries(messages).forEach(([id,message])=>{
    const field=form.querySelector('#'+CSS.escape(id));if(!field)return;
    field.addEventListener('invalid',()=>field.setCustomValidity(t(message)));
    ['input','change'].forEach(event=>field.addEventListener(event,()=>field.setCustomValidity('')));
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const button=form.querySelector('[type=submit]'),success=document.getElementById('form-success'),error=document.getElementById('form-error');
    success.classList.remove('show');error.classList.remove('show');button.disabled=true;button.setAttribute('aria-busy','true');button.textContent=t('Sending…');
    try{
      const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});
      if(!response.ok)throw Error('Submission failed');
      form.reset();success.classList.add('show');success.focus();
    }catch(_){error.classList.add('show');error.focus();}
    finally{button.disabled=false;button.removeAttribute('aria-busy');button.textContent=t('Send Message');}
  });
})();
