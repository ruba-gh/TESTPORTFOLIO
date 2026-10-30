import {copy,words,button} from './components.mjs';

const label=(en,ar)=>copy(words(en,ar));
const back=()=>`<a class="page-back" href="/">${label('Back home','العودة للرئيسية')}</a>`;
const social=()=>`<div class="page-socials"><a href="https://www.linkedin.com/in/ruba-alghamdi-a92981314/" target="_blank" rel="noopener noreferrer">LinkedIn </a><a href="https://github.com/ruba-gh" target="_blank" rel="noopener noreferrer">GitHub </a></div>`;
const eyebrow=(en,ar)=>`<p class="page-eyebrow">${label(en,ar)}</p>`;

export function aboutPage(){
 const services=[
  ['01-ux-interface','UX & interface design','تصميم تجربة المستخدم والواجهات','User flows, wireframes, prototypes and thoughtful interfaces.','مسارات المستخدم، وتخطيطات، ونماذج أولية، وواجهات مدروسة.'],
  ['02-websites','Websites & landing pages','المواقع وصفحات الهبوط','Clear, responsive spaces for your business or idea.','مواقع واضحة ومتجاوبة لمشروعك أو فكرتك.'],
  ['03-brand-illustration','Visual identities & illustration','الهويات البصرية والرسومات','Logos, brand direction and illustrations with personality.','شعارات، وتوجه بصري، ورسومات تعبر عن مشروعك.']
 ];
 return `<section class="page-hero page-about-hero"><div class="container">${back()}<div class="page-about-intro"><div>${eyebrow('The person behind the work','خلف هذه الأعمال')}<h1>${label('Hello, I’m Ruba.','أهلا، أنا ربى.')}</h1><p class="page-lead">${label('A UX/UI designer with a Computer Science background, based in Riyadh.','مصممة تجربة مستخدم وواجهات بخلفية في علوم الحاسب، من الرياض.')}</p>${button(words('Explore my work ','استكشف أعمالي '),'/#projects')}</div><div class="page-cap-art"><img src="/assets/images/hand-holding-cap.png" alt="" width="2172" height="2896" decoding="async"></div></div></div></section>
 <section class="page-background"><div class="container page-background-grid"><div>${eyebrow('A little background','نبذة عني')}<h2>${label('Ideas into experiences.','من الأفكار إلى التجارب.')}</h2><p>${label('I turn ideas into digital experiences that feel clear and considered. I work across UX, interface design and implementation, connecting how a product looks with how it works.','أحول الأفكار إلى تجارب رقمية واضحة ومدروسة. أعمل في تجربة المستخدم وتصميم الواجهات وتنفيذها، وأربط شكل المنتج بطريقة عمله.')}</p></div><dl class="page-facts"><div><dt>${label('Education','التعليم')}</dt><dd>${label('BSc Computer Science','بكالوريوس علوم الحاسب')}<span>${label('Princess Nourah University','جامعة الأميرة نورة')}</span></dd></div><div><dt>${label('Training','التدريب')}</dt><dd>${label('Apple Developer Academy','أكاديمية مطوري آبل')}<span>${label('Riyadh','الرياض')}</span></dd></div><div><dt>${label('My toolkit','أدواتي')}</dt><dd class="page-toolkit"><span>Figma</span><span>HTML / CSS</span><span>SwiftUI</span></dd></div></dl></div></section>
 <section class="page-services"><div class="container">${eyebrow('What we can make together','وش نقدر نصنع مع بعض')}<h2>${label('Design with intention.','تصميم بهدف.')}</h2><div class="page-service-grid">${services.map(([icon,en,ar,body,bodyAr])=>`<article class="page-service"><div class="page-service-icon"><img src="/assets/images/${icon}.svg" width="64" height="64" alt=""></div><h3>${label(en,ar)}</h3><p>${label(body,bodyAr)}</p></article>`).join('')}</div></div></section>`;
}

export function contactPage(page){
 const form=page.main.match(/<form\b[\s\S]*?<\/form>/)?.[0];
 if(!form)throw Error('Contact form is missing');
 return `<section class="page-hero"><div class="container">${back()}${eyebrow('A good place to start','بداية لفكرة جديدة')}<h1>${label('Let’s talk.','خلنا نتكلم.')}</h1><p class="page-lead">${label('Share the project, what you need, and the context I should know.','شاركني مشروعك، واحتياجك، والتفاصيل اللي تساعدني أفهم فكرتك.')}</p></div></section><section class="page-contact-section"><div class="container page-contact-grid"><aside class="page-contact-info">${eyebrow('Direct line','تواصل مباشر')}<h2>${label('Your next idea.','فكرتك الجاية.')}</h2><p>${label('Tell me about it. We’ll find a good place to start.','احكي لي عنها، ونلقى لها البداية المناسبة.')}<a class="page-email" href="mailto:rub.gmd23@gmail.com"><span>${label('Email me','راسلني')}</span><span dir="ltr">rub.gmd23@gmail.com </span></a>${social()}</aside><div class="page-form-panel">${eyebrow('Tell me a little more','خلني أعرف أكثر')}<h2>${label('The starting point.','نقطة البداية.')}</h2>${form}</div></div></section>`;
}

export function legalPage(route,page){
 const isPrivacy=route==='privacy';
 // Preserve the published policy text; omit the internal packaging note from the visitor UI.
 const content=page.main.replace(/<p class="notice">[\s\S]*?<\/p>/,'');
 const sections=[...content.matchAll(/<h2>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2>|$)/g)].map(([_,heading,body],i)=>({heading,body:body.replace(/<\/?(?:div|section)\b[^>]*>/g,''),id:`policy-${i+1}`}));
 if(!sections.length)throw Error(`Missing policy sections: ${route}`);
 return `<section class="page-hero page-legal-hero"><div class="container">${back()}${eyebrow('The details, clearly','التفاصيل بوضوح')}<h1>${isPrivacy?label('Privacy Policy','سياسة الخصوصية'):label('Terms & Conditions','الشروط والأحكام')}</h1><p class="page-lead">${isPrivacy?label('How information is handled when you visit, get in touch, or leave a note.','كيف يتم التعامل مع معلوماتك عند زيارة الموقع، أو التواصل، أو ترك رسالة.'):label('A few things to know about this portfolio and the work shared here.','معلومات عن استخدام هذا الموقع والأعمال المعروضة فيه.')}</p></div></section><div class="container page-legal-layout"><aside class="page-policy-nav"><p class="page-eyebrow">${label('On this page','في هذه الصفحة')}</p><nav aria-label="${isPrivacy?'Privacy policy sections':'Terms sections'}">${sections.map(s=>`<a href="#${s.id}">${s.heading}</a>`).join('')}</nav><a class="page-policy-other" href="/${isPrivacy?'terms':'privacy'}/">${isPrivacy?label('Terms & Conditions ','الشروط والأحكام '):label('Privacy Policy ','سياسة الخصوصية ')}</a></aside><div class="page-policy-content">${sections.map((s,i)=>`<section class="page-policy-section" id="${s.id}"><span class="page-policy-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div><h2>${s.heading}</h2>${s.body}</div></section>`).join('')}</div></div>`;
}

export function modernUtilityPage(route,page){
 return route==='about'?aboutPage():route==='contact'?contactPage(page):legalPage(route,page);
}
