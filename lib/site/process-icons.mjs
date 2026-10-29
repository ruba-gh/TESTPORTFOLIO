import {readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const expected={'01':'01-understand.svg','02':'02-explore.svg','03':'03-refine.svg'};
const fallback={'01':'icon-design.svg','02':'icon-code.svg','03':'icon-identity.svg'};
function filesIn(directory,prefix=''){
 return readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  if(entry.name.startsWith('.')||entry.name==='node_modules')return [];
  const relative=path.join(prefix,entry.name);
  return entry.isDirectory()?filesIn(path.join(directory,entry.name),relative):[relative];
 });
}
const allFiles=filesIn(root);
export const processIcons=Object.fromEntries(Object.entries(expected).map(([step,name])=>{
 const found=allFiles.find(file=>path.basename(file)===name);
 return [step,{name,src:found?'/'+found.split(path.sep).join('/'):'/assets/illustrations/'+fallback[step],missing:!found}];
}));
