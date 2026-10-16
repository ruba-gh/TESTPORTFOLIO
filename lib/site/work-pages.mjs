import {readFileSync} from 'node:fs';
import projects from '../../data/projects.mjs';
import {copy,words,escape,projectTile} from './components.mjs';
const pages=JSON.parse(readFileSync(new URL('../../data/work-pages.json',import.meta.url),'utf8'));
export function workPages(){
 return `<div class="atmo-work" data-work-pages><div class="atmo-work-controls" role="tablist" aria-label="${escape(words('Project types','أنواع المشاريع').en)}" data-alt-en="Project types" data-alt-ar="أنواع المشاريع">${pages.map((page,i)=>`<button id="work-tab-${escape(page.id)}" type="button" role="tab" aria-controls="work-panel-${escape(page.id)}" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" data-work-tab="${i}">${copy(page.title)}</button>`).join('')}</div><div class="atmo-work-track" data-work-track tabindex="0" aria-label="Swipe between Apps and Websites" data-alt-en="Swipe between Apps and Websites" data-alt-ar="اسحب للتنقل بين التطبيقات والمواقع">${pages.map((page,i)=>{
 const entries=projects.filter(p=>p.collection===page.id);
 return `<section id="work-panel-${escape(page.id)}" class="atmo-work-panel" role="tabpanel" aria-labelledby="work-tab-${escape(page.id)}" data-work-panel="${i}">${entries.length?`<div class="atmo-project-grid">${entries.map(projectTile).join('')}</div>`:`<div class="atmo-work-empty"><p>${copy(page.emptyText)}</p></div>`}</section>`;
 }).join('')}</div></div>`;
}
