import fs from 'node:fs/promises';
const [slug,collection='apps']=process.argv.slice(2);
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||'')||!['apps','websites'].includes(collection))throw Error('Usage: npm run project:add -- my-project apps|websites');
const file=new URL('../data/projects.json',import.meta.url),projects=JSON.parse(await fs.readFile(file,'utf8'));
if(projects.some(p=>p.slug===slug))throw Error(`Project ${slug} already exists.`);
const pair=(en,ar)=>({en,ar});
projects.push({slug,collection,draft:true,accent:'#CDC6EB',title:pair('Project title','عنوان المشروع'),category:pair('Project category','تصنيف المشروع'),headline:pair('Project headline','عنوان تقديم المشروع'),description:pair('Add the project description.','أضف وصف المشروع.'),overview:null,role:null,tools:[],deliverables:null,links:[],images:{logo:{src:null,alt:pair('Project logo','شعار المشروع')},hero:{src:null,alt:pair('Project prototype','نموذج المشروع')},closing:null},features:[{heading:pair('Feature heading','عنوان الميزة'),body:pair('Describe this feature.','أضف وصف هذه الميزة.'),image:{src:null,alt:pair('Feature image','صورة الميزة')}}]});
await fs.writeFile(file,JSON.stringify(projects,null,2)+'\n');
console.log(`Added ${slug} as a draft in data/projects.json. Edit both languages and artwork, then set draft to false and run npm run build.`);
