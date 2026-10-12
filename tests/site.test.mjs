import test from 'node:test';
import assert from 'node:assert/strict';
import projects from '../data/projects.mjs';
import {assets} from '../data/assets.mjs';
import {projectPage,homepage} from '../lib/site/templates.mjs';
import {placeholder} from '../lib/site/components.mjs';
test('verified live projects retain source data and use the same detail template',()=>{
 for(const p of projects.filter(p=>p.sourceStatus==='verified')){
  assert.equal(p.sections.length,3);assert.ok(p.overview.en);assert.ok(p.role.en);assert.ok(p.links.every(l=>l.url.startsWith('https://')));
  const html=projectPage(p);assert.equal((html.match(/class="atmo-narrative /g)||[]).length,3);assert.equal((html.match(/class="atmo-alt"/g)||[]).length,4);assert.ok(html.includes('image-end'));assert.ok(html.includes('/#projects'));
 }
});
test('unlisted projects do not acquire invented roles or case-study claims',()=>{for(const p of projects.filter(p=>p.sourceStatus==='not-listed')){assert.equal(p.role,null);assert.equal(p.outcomes,null);assert.equal(p.sections.length,0);assert.ok(projectPage(p).includes('Project details are being prepared.'));}});
test('homepage links every data project to its detail URL and uses ALT for all visuals',()=>{const html=homepage();for(const p of projects)assert.ok(html.includes(`/projects/${p.slug}/`));assert.equal((html.match(/class="atmo-alt"/g)||[]).length,9);assert.ok(!html.includes('<img'));assert.ok(!html.includes('<picture'));});
test('image configuration selects supplied src only, never provenance references',()=>{assert.ok(Object.values(assets).every(a=>a.src===null));const a=assets['budgie-prototype-1'];a.src='/assets/images/supplied.png';try{const html=placeholder('budgie-prototype-1');assert.ok(html.includes('src="/assets/images/supplied.png"'));assert.ok(html.includes(`alt="${a.alt}"`));assert.ok(!html.includes('rubalghamdi.com/assets/'));}finally{a.src=null;}});
