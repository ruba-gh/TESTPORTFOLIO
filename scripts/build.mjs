import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import projects from '../data/projects.mjs';
import {assets} from '../data/assets.mjs';
import {translations,navigation,placeholder} from '../lib/site/components.mjs';
import {homepage,projectPage,projectIndex,documentPage} from '../lib/site/templates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const write=async(file,text)=>{await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});await fs.writeFile(path.join(root,file),text);};
await write('index.html',homepage());await write('projects/index.html',projectIndex());
for(const project of projects)await write(`projects/${project.slug}/index.html`,projectPage(project));
const utilities=JSON.parse(await fs.readFile(path.join(root,'data/utility-pages.json'),'utf8'));
for(const [route,page] of Object.entries(utilities)){
 let index=0;
 // Retain useful forms, note-wall hooks, policies and text, but replace any old imagery.
 const main=page.main.replace(/<picture\b[\s\S]*?<\/picture>|<img\b[^>]*>/gi,markup=>{
  const id=`${route}-visual-${++index}`;return placeholder(id);
 });
 await write(route==='404'?'404.html':`${route}/index.html`,documentPage({title:page.title,description:page.title,path:route==='404'?'/404.html':`/${route}/`,utility:true,notes:route==='wall',body:`${navigation()}<main id="main">${main}</main>`}));
}
await write('locales/design.js',`window.PORTFOLIO_LOCALES=window.PORTFOLIO_LOCALES||{};window.PORTFOLIO_LOCALES.ar={...window.PORTFOLIO_LOCALES.ar,...${JSON.stringify(translations)}};\n`);
// Ratios, colors and radii are generated as external CSS to preserve the existing CSP.
await write('assets/css/asset-dimensions.css',Object.entries(assets).map(([id,a])=>`[data-asset="${id}"]{aspect-ratio:${a.ratio};${/^#[0-9a-f]{3,8}$/i.test(a.background)?`background:${a.background};`:''}${/^\d+(px|%)$/.test(a.radius)?`border-radius:${a.radius};`:''}${a.width?`width:${a.width};`:''}${a.height?`height:${a.height};`:''}}`).join('\n')+'\n');
console.log(`Built homepage, ${projects.length} shared-template project pages and ${Object.keys(utilities).length} preserved utility pages. ${Object.values(assets).filter(a=>a.src).length} linked images; ${Object.values(assets).filter(a=>!a.src).length} ALT slots.`);
