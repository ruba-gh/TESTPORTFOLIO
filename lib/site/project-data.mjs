const fail=(path,message)=>{throw new Error(`projects.json: ${path} ${message}`);};
function bilingual(value,path,optional=false){
 if(optional&&value==null)return;
 if(!value||typeof value!=='object'||['en','ar'].some(lang=>typeof value[lang]!=='string'||!value[lang].trim()))fail(path,'needs nonempty en and ar text.');
}
function image(value,fallback,path,defaults){
 const result={src:null,ratio:'4 / 5',background:'clear',radius:'soft',...defaults,...value,alt:value?.alt||fallback};
 bilingual(result.alt,`${path}.alt`);
 if(result.src!==null&&(typeof result.src!=='string'||!result.src.startsWith('/')||result.src.startsWith('//')))fail(`${path}.src`,'must be null or a local /assets/… path.');
 if(!/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(result.ratio))fail(`${path}.ratio`,'must be a width / height ratio.');
 return result;
}
export function normalizeProjects(entries){
 if(!Array.isArray(entries))fail('root','must be an array of projects.');
 const slugs=new Set();
 for(const p of entries){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug||''))fail('slug','must use lowercase letters, numbers and hyphens.');
  if(slugs.has(p.slug))fail(p.slug,'has a duplicate slug.');slugs.add(p.slug);
  if(!['apps','websites'].includes(p.collection))fail(p.slug+'.collection','must be apps or websites.');
 }
 return entries.filter(p=>!p.draft).map(p=>{
  const path=p.slug;
  for(const field of ['title','category','headline'])bilingual(p[field],`${path}.${field}`);
  for(const field of ['description','detailDesc','overview','role','deliverables','contentNotice'])bilingual(p[field],`${path}.${field}`,true);
  if(!/^#[0-9a-f]{6}$/i.test(p.accent||''))fail(path+'.accent','must be a six-digit hex color such as #6FAFCD.');
  if(!Array.isArray(p.features))fail(path+'.features','must be an array; use [] for no features.');
  if(!Array.isArray(p.links)||!Array.isArray(p.tools))fail(path,'needs links and tools arrays (they may be empty).');
  for(const [i,link] of p.links.entries()){
   bilingual(link.label,`${path}.links[${i}].label`);
   if(!/^https:\/\//.test(link.url||'')&&!/^\/(?!\/)/.test(link.url||''))fail(`${path}.links[${i}].url`,'must be an HTTPS URL or local path.');
  }
  const fallback=kind=>({en:`${p.title.en} ${kind}`,ar:`${kind==='logo'?'شعار':'نموذج'} ${p.title.ar}`});
  const images={logo:image(p.images?.logo,fallback('logo'),path+'.images.logo',{ratio:'1 / 1',background:'logo',radius:'logo'}),hero:image(p.images?.hero,fallback('prototype'),path+'.images.hero',{background:'green'})};
  if(p.images?.closing)images.closing=image(p.images.closing,fallback('prototype'),path+'.images.closing');
  const sections=p.features.map((feature,i)=>{
   bilingual(feature.heading,`${path}.features[${i}].heading`);bilingual(feature.body,`${path}.features[${i}].body`);
   if(feature.theme&&!['light','dark'].includes(feature.theme))fail(`${path}.features[${i}].theme`,'must be light or dark.');
   return {...feature,asset:`${p.slug}-prototype-${i+1}`,image:image(feature.image,{en:`${p.title.en}: ${feature.heading.en.replaceAll('\n',' ')}`,ar:`${p.title.ar}: ${feature.heading.ar.replaceAll('\n',' ')}`},`${path}.features[${i}].image`,{ratio:'640 / 520',background:i%2?'dark':'light'})};
  });
  return {...p,images,sections,assets:{logo:`${p.slug}-logo`,hero:`${p.slug}-hero`,...(images.closing?{closing:`${p.slug}-closing`}:{})}};
 });
}
export function accentInk(hex){
 const luminance=color=>{
  const [r,g,b]=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return r*.2126+g*.7152+b*.0722;
 };
 const value=luminance(hex),dark=luminance('#111111'),light=luminance('#F3EFEA');
 const darkContrast=(value+.05)/(dark+.05),lightContrast=(light+.05)/(value+.05);
 if(Math.max(darkContrast,lightContrast)<4.5)return (value+.05)/.05>=1.05/(value+.05)?'#000000':'#FFFFFF';
 return darkContrast>=lightContrast?'#111111':'#F3EFEA';
}
