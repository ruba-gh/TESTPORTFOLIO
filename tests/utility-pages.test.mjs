import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {modernUtilityPage} from '../lib/site/utility-pages.mjs';
import {processIcons} from '../lib/site/process-icons.mjs';
const pages=JSON.parse(readFileSync(new URL('../data/utility-pages.json',import.meta.url),'utf8'));
test('redesigned policies retain policy sections and every navigation target exists',()=>{
 for(const route of ['terms','privacy']){
  const html=modernUtilityPage(route,pages[route]);
  const headings=[...pages[route].main.matchAll(/<h2>(.*?)<\/h2>/g)].map(m=>m[1]);
  for(const heading of headings)assert.ok(html.includes(`<h2>${heading}</h2>`));
  for(const [,id] of html.matchAll(/href="#(policy-\d+)"/g))assert.ok(html.includes(`id="${id}"`));
  const publicText=pages[route].main.replace(/<p class="notice">[\s\S]*?<\/p>/,'');
  for(const [paragraph] of publicText.matchAll(/<p>[\s\S]*?<\/p>/g))assert.ok(html.includes(paragraph));
 }
});
test('contact layout preserves the complete Netlify form and its feedback hooks',()=>{
 const original=pages.contact.main.match(/<form\b[\s\S]*?<\/form>/)[0];
 assert.ok(modernUtilityPage('contact',pages.contact).includes(original));
});
test('process icons recognize the supplied filenames and always render an available asset',()=>{
 assert.deepEqual(Object.values(processIcons).map(x=>x.name),['01-understand.svg','02-explore.svg','03-refine.svg']);
 for(const icon of Object.values(processIcons))assert.ok(existsSync(new URL('..'+icon.src,import.meta.url)));
});
