(() => {
  const wall = document.querySelector('[data-note-wall]');
  if (!wall) return;
  const t = value => window.PORTFOLIO_I18N?.t(value) || value;
  const board = wall.querySelector('[data-note-board]'), status = wall.querySelector('[data-wall-status]');
  const compose = document.getElementById('compose-dialog'), remove = document.getElementById('delete-dialog');
  const form = document.getElementById('note-form'), removeForm = document.getElementById('delete-note-form');
  const composeFeedback = document.querySelector('[data-compose-feedback]'), deleteFeedback = document.querySelector('[data-delete-feedback]');
  const message = document.getElementById('note-message');
  const updatePreview=()=>{
    const preview=document.querySelector('[data-note-preview]');if(!preview)return;
    const color=new FormData(form).get('color');preview.className='sticky-note '+(['yellow','peach','blue'].includes(color)?color:'yellow');
    preview.querySelector('[data-preview-message]').textContent=message.value.trim()||t('Your note will appear here.');
    preview.querySelector('[data-preview-name]').textContent='— '+(form.elements.name.value.trim()||t('Anonymous'));
  };
  form.addEventListener('input',updatePreview);form.addEventListener('change',updatePreview);
  form.addEventListener('reset',()=>queueMicrotask(updatePreview));
  document.addEventListener('portfolio-language-change',updatePreview);
  updatePreview();
  let revision = 0;
  let notes = [], selectedId = null, loaded = false, busy = false, shown = location.pathname.startsWith('/wall') ? 12 : 4;
  let previousFocus = null;
  const api = async (method = 'GET', data) => {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('/api/notes', { method, cache:'no-store', headers:data ? {'Content-Type':'application/json'} : {}, body:data ? JSON.stringify(data) : undefined, signal:controller.signal });
      if (!response.ok) {
        let code;try { code = (await response.json()).error; } catch (_) {}
        throw new Error(response.status === 429 ? 'Too many requests. Please wait a minute.' : code === 'password' ? 'That password is incorrect.' : 'The wall is unavailable right now. Please try again.');
      }
      return await response.json();
    } finally { clearTimeout(timeout); }
  };
  const showDialog = dialog => {
    previousFocus = document.activeElement;
    dialog.showModal();
  };
  const closeDialog = dialog => { dialog.close(); };
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click',()=>closeDialog(button.closest('dialog'))));
  [compose,remove].forEach(dialog=>dialog.addEventListener('close',()=>{
    if (previousFocus?.isConnected) previousFocus.focus();
    else wall.querySelector('[data-compose]').focus();
    if(dialog===remove){selectedId=null;removeForm.reset();deleteFeedback.textContent='';}
  }));
  document.querySelector('[data-compose]').addEventListener('click',()=>{composeFeedback.textContent='';updatePreview();showDialog(compose);});
  message.addEventListener('input',()=>document.getElementById('note-count').textContent=`${message.value.length} / 280`);
  const reveal = card => {
    board.querySelectorAll('.editing').forEach(el=>{if(el!==card)el.classList.remove('editing');});
    card.classList.add('editing');
  };
  const makeNote = note => {
    const card = document.createElement('article');
    card.className = 'sticky-note ' + (['yellow','peach','blue'].includes(note.color) ? note.color : 'yellow');
    card.tabIndex = 0;card.setAttribute('role','group');
    card.setAttribute('aria-label',`${t('Note by')} ${note.name || t('Anonymous')}. ${t('Hold to show delete. Keyboard: Shift + F10.')}`);
    const text = document.createElement('p');text.className='note-message';text.dir='auto';text.textContent=note.message;
    const byline = document.createElement('p');byline.className='note-byline';byline.dir='auto';byline.textContent='— '+(note.name || t('Anonymous'));
    const button = document.createElement('button');button.type='button';button.className='note-delete';button.textContent='×';button.setAttribute('aria-label',t('Delete note'));
    button.addEventListener('click',()=>{selectedId=note.id;deleteFeedback.textContent='';showDialog(remove);});
    card.append(text,byline,button);
    let timer, point;
    const cancel = () => {clearTimeout(timer);timer=null;};
    card.addEventListener('pointerdown',event=>{
      if(event.target.closest('button') || (event.pointerType==='mouse' && event.button!==0))return;
      cancel();point={x:event.clientX,y:event.clientY};timer=setTimeout(()=>{reveal(card);timer=null;},650);
    });
    card.addEventListener('pointermove',event=>{if(point && Math.hypot(event.clientX-point.x,event.clientY-point.y)>10)cancel();});
    ['pointerup','pointercancel','pointerleave'].forEach(type=>card.addEventListener(type,cancel));
    card.addEventListener('contextmenu',event=>{event.preventDefault();cancel();reveal(card);});
    card.addEventListener('keydown',event=>{
      if(event.target!==card)return;
      if(event.key==='F10' && event.shiftKey){event.preventDefault();reveal(card);button.focus();}
      if(event.key===' ' && !event.repeat){event.preventDefault();cancel();timer=setTimeout(()=>reveal(card),650);}
      if(event.key==='Escape')card.classList.remove('editing');
    });
    card.addEventListener('keyup',cancel);card.addEventListener('blur',cancel);
    return card;
  };
  const render = () => {
    board.replaceChildren();
    if(!notes.length){
      const empty=document.createElement('div');empty.className='empty-wall';empty.textContent=t('The wall is waiting for its first hello.');board.append(empty);
    } else notes.slice(0,shown).forEach(note=>board.append(makeNote(note)));
    let more=wall.querySelector('.wall-more');
    if(location.pathname.startsWith('/wall') && shown<notes.length){
      if(!more){more=document.createElement('button');more.className='button secondary wall-more';more.type='button';more.addEventListener('click',()=>{shown+=12;render();});wall.querySelector('.wall-foot').before(more);}
      more.textContent=t('More notes');
    } else more?.remove();
  };
  const load = async () => {
    if(busy || compose.open || remove.open)return;
    busy=true;const started=revision;
    try {
      const data=await api();
      if(started!==revision)return;
      if(!loaded || JSON.stringify(notes)!==JSON.stringify(data.notes)){notes=data.notes;render();}
      loaded=true;status.textContent='';
    } catch(error){status.textContent=t(error.message);}
    finally{busy=false;}
  };
  const submit = async (event, targetForm, feedback, action) => {
    event.preventDefault();
    if(!targetForm.reportValidity())return;
    const button=targetForm.querySelector('[type=submit]');button.disabled=true;button.setAttribute('aria-busy','true');feedback.textContent='';
    try {await action();}catch(error){feedback.textContent=t(error.message);}
    finally{button.disabled=false;button.removeAttribute('aria-busy');}
  };
  form.addEventListener('submit',event=>submit(event,form,composeFeedback,async()=>{
    const data=Object.fromEntries(new FormData(form));
    if(!data.message.trim()){composeFeedback.textContent=t('Please write a note first.');return;}
    const result=await api('POST',data);revision++;notes.unshift(result.note);loaded=true;render();status.textContent=t('Your note is on the wall.');form.reset();document.getElementById('note-count').textContent='0 / 280';closeDialog(compose);
  }));
  removeForm.addEventListener('submit',event=>submit(event,removeForm,deleteFeedback,async()=>{
    if(!selectedId)return;
    const id=selectedId;await api('DELETE',{id,password:new FormData(removeForm).get('password')});revision++;notes=notes.filter(note=>note.id!==id);render();status.textContent=t('Note removed.');closeDialog(remove);
  }));
  document.addEventListener('portfolio-language-change',()=>{if(loaded)render();load();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
  setInterval(()=>{if(!document.hidden)load();},60000);
  document.querySelector('[data-wall-retry]')?.addEventListener('click',load);
  load();
})();
