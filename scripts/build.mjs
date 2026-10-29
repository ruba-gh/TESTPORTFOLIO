import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import projects from '../data/projects.mjs';
import {modernUtilityPage} from '../lib/site/utility-pages.mjs';
import {processIcons} from '../lib/site/process-icons.mjs';
import {accentInk} from '../lib/site/project-data.mjs';
import {assets} from '../data/assets.mjs';
import {translations,navigation,placeholder} from '../lib/site/components.mjs';
import {homepage,projectPage,projectIndex,documentPage} from '../lib/site/templates.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const write=async(file,text)=>{await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});await fs.writeFile(path.join(root,file),text);};
await write('index.html',homepage());await write('projects/index.html',projectIndex());
const manifestPath=path.join(root,'data/generated-project-routes.json');
const previous=JSON.parse(await fs.readFile(manifestPath,'utf8').catch(()=>"[]"));
for(const slug of previous.filter(slug=>!projects.some(p=>p.slug===slug))){
 if(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))await fs.rm(path.join(root,'projects',slug,'index.html'),{force:true});
}
for(const project of projects)await write(`projects/${project.slug}/index.html`,projectPage(project));
await write('data/generated-project-routes.json',JSON.stringify(projects.map(p=>p.slug),null,2)+'\n');
const utilities=JSON.parse(await fs.readFile(path.join(root,'data/utility-pages.json'),'utf8'));
for(const [route,page] of Object.entries(utilities)){
 let index=0;
 const modern=['about','contact','privacy','terms'].includes(route);
 // Retain useful forms, note-wall hooks, policies and text, but replace any old imagery.
 const main=modern?modernUtilityPage(route,page):page.main.replace(/<picture\b[\s\S]*?<\/picture>|<img\b[^>]*>/gi,markup=>{
  const id=`${route}-visual-${++index}`;return placeholder(id);
 });
 await write(route==='404'?'404.html':`${route}/index.html`,documentPage({title:page.title.replaceAll('&amp;','&'),description:page.title.replaceAll('&amp;','&'),path:route==='404'?'/404.html':`/${route}/`,utility:true,modern,notes:route==='wall',body:`${navigation()}<main id="main">${main}</main>`}));
}
await write('locales/design.js',`window.PORTFOLIO_LOCALES=window.PORTFOLIO_LOCALES||{};window.PORTFOLIO_LOCALES.ar={...window.PORTFOLIO_LOCALES.ar,...${JSON.stringify(translations)}};\n`);
// Ratios, colors and radii are generated as external CSS to preserve the existing CSP.
await write('assets/css/asset-dimensions.css',Object.entries(assets).map(([id,a])=>`[data-asset="${id}"]{aspect-ratio:${a.ratio};${/^#[0-9a-f]{3,8}$/i.test(a.background)?`background:${a.background};`:''}${/^\d+(px|%)$/.test(a.radius)?`border-radius:${a.radius};`:''}${a.width?`width:${a.width};`:''}${a.height?`height:${a.height};`:''}}`).join('\n')+'\n'+projects.filter(p=>/^#[0-9a-f]{6}$/i.test(p.accent||'')).map(p=>`[data-project="${p.slug}"]{--project-accent:${p.accent};--project-ink:${accentInk(p.accent)};}`).join('\n')+'\n');
console.log(`Built homepage, ${projects.length} shared-template project pages and ${Object.keys(utilities).length} preserved utility pages. ${Object.values(assets).filter(a=>a.src).length} linked images; ${Object.values(assets).filter(a=>!a.src).length} ALT slots.`);

for(const icon of Object.values(processIcons))if(icon.missing)console.warn(`Step icon upload is missing: ${icon.name}. Keeping the existing SVG until the file is added.`);
