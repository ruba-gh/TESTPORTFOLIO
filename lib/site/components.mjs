import {processIcons} from './process-icons.mjs';
import {assets} from '../../data/assets.mjs';
export const translations={};
export const escape=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function copy(value){
 if(value==null)return '';
 if(typeof value==='string')return escape(value).replaceAll('\n','<br>');
 const {en,ar}=value;
 translations[en.replace(/\s+/g,' ').trim()]=ar.replace(/\s+/g,' ').trim();
 return `<span data-copy-en="${escape(en)}" data-copy-ar="${escape(ar)}">${escape(en).replaceAll('\n','<br>')}</span>`;
}
export const words=(en,ar)=>({en,ar});
export function placeholder(id,className=''){
 const a=assets[id];if(!a)throw Error(`Unknown asset: ${id}`);
 const alt=typeof a.alt==='string'?{en:a.alt,ar:a.alt}:a.alt;
 const localized=`data-alt-en="${escape(alt.en)}" data-alt-ar="${escape(alt.ar)}"`;
 return `<div class="atmo-visual ${escape(className)}${a.src?' has-image':''} tone-${escape(a.background)} radius-${escape(a.radius)}" data-asset="${escape(id)}" role="img" aria-label="${escape(alt.en)}" ${localized}>${a.src?`<img src="${escape(a.src)}" alt="${escape(alt.en)}" ${localized} decoding="async" loading="${a.loading==='eager'?'eager':'lazy'}">`:'<span class="atmo-alt" aria-hidden="true">ALT</span>'}</div>`;
}
export function language(){return `<div class="atmo-language" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><span aria-hidden="true">/</span><button type="button" data-lang="ar" aria-pressed="false">عربي</button></div>`;}
export function navigation(detail=false){return `<header class="atmo-nav container">${detail?`<a class="atmo-back" href="/#projects">${copy(words('← All projects','كل المشاريع ←'))}</a><a class="atmo-brand" href="/" aria-label="Ruba Alghamdi, home">ruba.</a>`:`<a class="atmo-brand" href="/" aria-label="Ruba Alghamdi, home">ruba.</a><nav aria-label="Primary"><a class="desktop-nav" href="/#projects">${copy(words('Projects','المشاريع'))}</a><a class="desktop-nav" href="/#process">${copy(words('My process','طريقتي'))}</a><a href="/#contact">${copy(words('Contact ↗','تواصل ↗'))}</a></nav>`}</header>`;}
export function button(label,href,external=false){return `<a class="atmo-button" href="${escape(href)}"${external?' target="_blank" rel="noopener noreferrer"':''}>${copy(label)}</a>`;}
export function projectTile(p){const preparing=!!p.contentNotice && p.sections.length===0;return `<a class="atmo-project${preparing?' is-preparing':''}" href="/projects/${escape(p.slug)}/">${placeholder(p.assets.logo)}<h3>${copy(p.title)}</h3><p>${copy(preparing?words('Coming soon','قيد التجهيز'):p.category)}</p></a>`;}
export function processStep(number,title,body){const icon=processIcons[number];return `<div class="atmo-step"><img class="atmo-step-icon" src="${escape(icon.src)}" data-process-icon="${escape(icon.name)}" width="48" height="48" alt="" aria-hidden="true"><h3>${copy(title)}</h3><p>${copy(body)}</p></div>`;}
export function contact(){return `<section class="atmo-contact" id="contact">${placeholder('mist','atmo-transition')}<div class="container"><h2>${copy(words('Let’s make\nsomething matter.','لنصنع\nشيئًا له قيمة.'))}</h2><div class="atmo-computer">${placeholder('computer')}<div class="atmo-screen"><h3>${copy(words('Your next idea\nstarts here.','فكرتك القادمة\nتبدأ هنا.'))}</h3>${button(words('Start a conversation ↗','ابدأ محادثة ↗'),'mailto:rub.gmd23@gmail.com')}</div></div></div></section>`;}
export function footer(){return `<footer class="atmo-footer container"><div class="atmo-footer-row"><span>© <span data-year>${new Date().getFullYear()}</span> ${copy(words('Ruba Alghamdi','ربى الغامدي'))}</span><span>${copy(words('Designed with intention.','صُمم بهدف.'))}</span>${language()}</div><nav class="atmo-footer-links" aria-label="More information"><a href="/about/">${copy(words('About','عنّي'))}</a><a href="/contact/">${copy(words('Contact form','نموذج التواصل'))}</a><a href="/wall/">${copy(words('Note wall','جدار الرسائل'))}</a><a href="/privacy/">${copy(words('Privacy','الخصوصية'))}</a><a href="/terms/">${copy(words('Terms','الشروط'))}</a></nav></footer>`;}
export function projectSection(section,index){return `<section class="atmo-narrative ${(section.theme|| (index%2?'dark':'light'))==='dark'?'is-dark':''}"><div class="container atmo-pair ${index%2?'image-end':''}"><div class="atmo-narrative-copy"><h2>${copy(section.heading)}</h2><p>${copy(section.body)}</p></div>${placeholder(section.asset,'atmo-prototype')}</div></section>`;}
