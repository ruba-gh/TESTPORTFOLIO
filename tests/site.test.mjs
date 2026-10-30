import test from 'node:test';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import projects from '../data/projects.mjs';
import {assets,registerProjectAssets} from '../data/assets.mjs';
import {projectPage,homepage} from '../lib/site/templates.mjs';
import {placeholder,copy} from '../lib/site/components.mjs';
import {normalizeProjects,accentInk} from '../lib/site/project-data.mjs';
const fixture=(slug,count,collection='apps',accent='#28183D')=>({slug,collection,accent,title:{en:'A project',ar:'مشروع'},category:{en:'Design',ar:'تصميم'},headline:{en:'A headline',ar:'عنوان'},description:null,overview:null,role:null,tools:[],links:[],images:{},features:Array.from({length:count},(_,i)=>({heading:{en:`Feature ${i+1}`,ar:`ميزة ${i+1}`},body:{en:'An explanation.',ar:'شرح.'}}))});
test('project routes use one template and retain the configured feature count',()=>{
 for(const p of projects){const html=projectPage(p);assert.equal((html.match(/class="atmo-narrative /g)||[]).length,p.sections.length);assert.ok(html.includes('/#projects'));for(const link of p.links)assert.ok(html.includes(link.url.replaceAll('&','&amp;')));}
});
test('zero, one and five features render without a fixed three-section limit',()=>{
 for(const count of [0,1,5]){
  const p=normalizeProjects([fixture('test-project',count)])[0];
  registerProjectAssets([p]);const html=projectPage(p);assert.equal(p.sections.length,count);assert.equal((html.match(/class="atmo-narrative /g)||[]).length,count);assert.equal((html.match(/image-end/g)||[]).length,Math.floor(count/2));
  assert.equal(p.images.hero.src,null);assert.ok(p.sections.every(s=>s.image.src===null));
 }
});
test('each project keeps an independent accent and the readable text color follows it',()=>{
 const [a,b]=normalizeProjects([fixture('one',0,'apps','#111111'),fixture('two',1,'websites','#FFFFFF')]);assert.notEqual(a.accent,b.accent);assert.equal(accentInk(a.accent),'#F3EFEA');assert.equal(accentInk(b.accent),'#111111');assert.equal(b.collection,'websites');assert.equal(accentInk('#777777'),'#000000');
});
test('drafts do not create public routes and incomplete bilingual fields fail clearly',()=>{
 assert.equal(normalizeProjects([{slug:'draft-project',collection:'websites',draft:true}]).length,0);
 const p=fixture('missing-ar',1);delete p.features[0].body.ar;assert.throws(()=>normalizeProjects([p]),/missing-ar.features\[0\].body needs nonempty en and ar/);
 assert.throws(()=>normalizeProjects([fixture('duplicate',0),fixture('duplicate',0)]),/duplicate slug/);
 assert.throws(()=>normalizeProjects([fixture('bad-color',0,'apps','blue')]),/six-digit hex/);
});
test('paired translations stay scoped even when English text repeats',()=>{
 const a=copy({en:'Overview',ar:'نبذة'}),b=copy({en:'Overview',ar:'نظرة عامة'});assert.ok(a.includes('data-copy-ar="نبذة"'));assert.ok(b.includes('data-copy-ar="نظرة عامة"'));
 const p=normalizeProjects([fixture('translated',1)])[0];registerProjectAssets([p]);const html=projectPage(p);assert.ok(html.includes('data-title-ar="مشروع — ربى الغامدي"'));assert.ok(html.includes('data-copy-ar="ميزة 1"'));
});
test('homepage contains exactly two work pages and routes every published project',()=>{
 const html=homepage();for(const p of projects)assert.ok(html.includes(`/projects/${p.slug}/`));
 assert.equal((html.match(/role="tabpanel"/g)||[]).length,2);assert.ok(html.includes('work-panel-apps'));assert.ok(html.includes('work-panel-websites'));
 const ids=['head','mist','hands','computer',...projects.map(p=>p.assets.logo)];assert.equal((html.match(/<img (?!class="atmo-step-icon")/g)||[]).length,ids.filter(id=>assets[id].src).length+1);assert.equal((html.match(/class="atmo-alt"/g)||[]).length,ids.filter(id=>!assets[id].src).length);
});
test('image rendering selects supplied src and paired alt, never provenance references',()=>{
 const a=assets['budgie-prototype-1'],original=a.src;a.src='/assets/images/supplied.png';try{const html=placeholder('budgie-prototype-1');assert.ok(html.includes('src="/assets/images/supplied.png"'));assert.ok(html.includes(`alt="${a.alt.en}"`));assert.ok(html.includes(`data-alt-ar="${a.alt.ar}"`));assert.ok(!html.includes('rubalghamdi.com/assets/'));}finally{a.src=original;}
});
test('every configured local image resolves to an uploaded asset',()=>{for(const asset of Object.values(assets).filter(a=>a.src))assert.ok(existsSync(new URL('..'+decodeURIComponent(asset.src),import.meta.url)),asset.src);});
