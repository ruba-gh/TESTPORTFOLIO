import test from 'node:test';
import {existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import projects from '../data/projects.mjs';
import {assets} from '../data/assets.mjs';
import {projectPage,homepage} from '../lib/site/templates.mjs';
import {placeholder} from '../lib/site/components.mjs';
test('verified live projects retain source data and use the same detail template',()=>{
 for(const p of projects.filter(p=>p.sourceStatus==='verified')){
  assert.equal(p.sections.length,3);assert.ok(p.overview.en);assert.ok(p.role.en);assert.ok(p.links.every(l=>l.url.startsWith('https://')));
  const html=projectPage(p);assert.equal((html.match(/class="atmo-narrative /g)||[]).length,3);assert.equal((html.match(/class="atmo-alt"/g)||[]).length,p.slug==='budgie'?0:4);assert.ok(html.includes('image-end'));assert.ok(html.includes('/#projects'));
 }
});
test('unlisted projects do not acquire invented roles or case-study claims',()=>{for(const p of projects.filter(p=>p.sourceStatus==='not-listed')){assert.equal(p.role,null);assert.equal(p.outcomes,null);assert.equal(p.sections.length,0);assert.ok(projectPage(p).includes('Project details are being prepared.'));}});
test('homepage connects supplied artwork and retains unfilled ALT slots',()=>{const html=homepage();for(const p of projects)assert.ok(html.includes(`/projects/${p.slug}/`));assert.equal((html.match(/class="atmo-alt"/g)||[]).length,1);assert.equal((html.match(/<img /g)||[]).length,9);for(const id of ['head','mist','hands','computer','budgie-logo','after-taste-logo','gareeb-logo','qamareya-logo','day-diamond-logo'])assert.ok(html.includes(`src="${assets[id].src}"`));assert.equal(assets['dailys-logo'].src,null);});
test('image configuration selects supplied src only, never provenance references',()=>{assert.ok(projects.filter(p=>p.slug!=='budgie').every(p=>assets[p.assets.hero].src===null&&[1,2,3].every(i=>assets[`${p.slug}-prototype-${i}`].src===null))); const a=assets['budgie-prototype-1'];const original=a.src;a.src='/assets/images/supplied.png';try{const html=placeholder('budgie-prototype-1');assert.ok(html.includes('src="/assets/images/supplied.png"'));assert.ok(html.includes(`alt="${a.alt}"`));assert.ok(!html.includes('rubalghamdi.com/assets/'));}finally{a.src=original;}});

test('every configured local image resolves to an uploaded asset',()=>{for(const asset of Object.values(assets).filter(a=>a.src)){assert.ok(existsSync(new URL('..'+decodeURIComponent(asset.src),import.meta.url)),asset.src);}});
