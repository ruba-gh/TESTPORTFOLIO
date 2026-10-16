import {readFileSync} from 'node:fs';
const source=JSON.parse(readFileSync(new URL('./portfolio-source.json',import.meta.url),'utf8'));
const pair=(en,ar)=>({en,ar});
const sections={
 budgie:[
 [pair('Bring spending\ntogether.','كل مصروفاتك\nفي مكان واحد.'),pair('Import transactions with SMS and Shortcuts, bringing everyday purchases into one budgeting experience. Less manual input means more room to stay aware of your money.','استيراد المعاملات عبر الرسائل النصية وShortcuts يجمع المشتريات اليومية في تجربة ميزانية واحدة. إدخال يدوي أقل يعني مساحة أكبر لمتابعة أموالك.')],
 [pair('See the patterns\nbehind the purchases.','افهم الأنماط\nخلف المشتريات.'),pair('Categories and rules organize transactions into a clearer picture of everyday spending. Insights help connect individual purchases with the bigger picture.','التصنيفات والقواعد تنظّم المعاملات لتكوين صورة أوضح للإنفاق اليومي. تساعد الرؤى على ربط المشتريات الفردية بالصورة الأكبر.')],
 [pair('Clarity before\ncomplexity.','الوضوح قبل\nالتعقيد.'),pair('Budgie’s onboarding was simplified from six steps to three. A lock-screen widget keeps useful information close, bringing the experience into everyday moments.','تم تبسيط خطوات البدء في بدجي من ست خطوات إلى ثلاث. وتتيح أداة شاشة القفل الوصول للمعلومات المفيدة في اللحظات اليومية.')]
 ],
 gareeb:[
 [pair('A small errand.\nA shared opportunity.','مشوار بسيط.\nفرصة مشتركة.'),pair('Gareeb was created to solve a common daily problem: needing one or two small items without wanting to make a full trip or pay high delivery fees.','صمم قريب لحل مشكلة يومية شائعة: الحاجة لغرض أو غرضين بسيطين بدون مشوار كامل أو رسوم توصيل عالية.')],
 [pair('Everyday movement,\nput to good use.','الحركة اليومية\nتصنع فائدة.'),pair('The app turns everyday neighborhood movement into shared opportunities, allowing users to request quick pickups from nearby stores such as pharmacies, bakeries, groceries, and local shops.','يحول التطبيق حركة سكان الحي اليومية إلى فرص مشتركة، بحيث يمكن للمستخدم طلب أغراض بسيطة من أماكن قريبة مثل الصيدلية، المخبز، البقالة، أو المتاجر المحلية.')],
 [pair('From service concept\nto prototype.','من فكرة الخدمة\nإلى نموذج تفاعلي.'),pair('Project deliverables: User Flow, Service Concept, UI Screens, Prototype.','مخرجات المشروع: مسار المستخدم، فكرة الخدمة، شاشات واجهة، نموذج تفاعلي.')]
 ],
 qamareya:[
 [pair('Different stages.\nOne experience.','مراحل مختلفة.\nتجربة واحدة.'),pair('Qamareya brings pregnancy tracking, fertility tracking, and menstrual cycle tracking into one unified platform.','يجمع قمرية تتبع الحمل، الخصوبة، والدورة الشهرية داخل منصة واحدة متكاملة.')],
 [pair('Inspired by\nnatural rhythms.','مستوحى من\nالإيقاع الطبيعي.'),pair('The name is inspired by the Arabic word Qamar, meaning moon, reflecting rhythm, phases, softness, and natural cycles.','الاسم مستوحى من كلمة قمر، بما تحمله من معنى الإيقاع، المراحل، النعومة، والدورات الطبيعية.')],
 [pair('Understanding,\nwith support nearby.','فهم أوضح،\nودعم أقرب.'),pair('The app creates a calm and organized experience that helps women understand their bodies, follow health changes, access reliable content, and communicate with specialists when needed.','يقدم التطبيق تجربة هادئة ومنظمة تساعد المرأة على فهم جسمها، متابعة التغيرات الصحية، الوصول إلى محتوى موثوق، والتواصل مع المختصين عند الحاجة.')]
 ],
 'day-diamond':[
 [pair('Find value\nin free moments.','قيمة أكبر\nللحظات الفراغ.'),pair('Day Diamond is a concept born from a simple observation: free time often disappears without us noticing. Many people do not intentionally choose to spend hours on their phones; it slowly happens because scrolling is the easiest option available.','بدأت فكرة الماس اليوم من ملاحظة بسيطة: وقت الفراغ غالبًا يختفي بدون ما ننتبه. كثير من الناس ما يختارون قضاء ساعات طويلة على الجوال عمدًا، لكنه يحدث تدريجيًا لأن التمرير هو الخيار الأسهل.')],
 [pair('Make time\nfeel rewarding.','وقت ممتع\nيستحق التجربة.'),pair('The app approaches this problem with a lighter mindset by making better use of time feel playful, approachable, and rewarding. Through short real-world challenges, points, and leaderboard motivation, Day Diamond encourages users to see small free moments as something valuable.','يتعامل التطبيق مع هذه المشكلة بطريقة أخف وأقرب للمستخدم، حيث يجعل استثمار الوقت ممتعًا، بسيطًا، ومحفزًا. من خلال تحديات واقعية قصيرة، نقاط، ولوحة صدارة، يشجع الماس اليوم المستخدمين على رؤية اللحظات الصغيرة في يومهم كشيء قيّم.')],
 [pair('A diamond\nin an ordinary day.','ألماسة\nفي يوم عادي.'),pair('The name reflects this idea: a day diamond is a valuable moment hidden inside an ordinary day.','ويرتبط الاسم بهذه الفكرة: ألماسة اليوم هي لحظة ثمينة مخفية داخل يوم عادي.')]
 ]
};
const info={
 budgie:{id:'budgie-budgeting-app',accent:'#6FAFCD',category:pair('Budgeting · iOS','ميزانية · iOS'),headline:pair('Everyday money,\nmade clearer.','أموالك اليومية،\nبصورة أوضح.'),description:pair('A budgeting app that turns everyday spending into a clearer picture of your money.','تطبيق ميزانية يحوّل إنفاقك اليومي إلى صورة أوضح لأموالك.')},
 gareeb:{id:'gareeb-delivery-app',category:pair('Delivery · Product concept','توصيل · فكرة منتج'),headline:pair('Small errands,\ncloser to home.','مشاوير بسيطة،\nأقرب لبيتك.')},
 qamareya:{id:'qamareya-womens-health-app',category:pair('Wellness · Product concept','عافية · فكرة منتج'),headline:pair('A calmer way\nto understand your body.','طريقة أهدأ\nلفهم جسمك.')},
 'day-diamond':{id:'day-diamond-app',category:pair('Digital wellbeing','عافية رقمية'),headline:pair('Make more\nof everyday moments.','استثمر أكثر\nفي لحظاتك اليومية.')}
};
const projects=Object.entries(info).map(([slug,item])=>{
 const original=source.projects.find(p=>p.id===item.id);
 const links=[['prototypeUrl',pair('View prototype ↗','عرض النموذج التفاعلي ↗')],['presentationUrl',pair('View presentation PDF ↗','عرض ملف PDF ↗')],['appStoreUrl',pair('View on App Store ↗','عرض على App Store ↗')]].filter(([key])=>original[key]).map(([key,label])=>({label,url:new URL(original[key],'https://rubalghamdi.com/').href}));
 return {slug,...original,...item,description:item.description||original.detailDesc,sourceUrl:`https://rubalghamdi.com/project.html?id=${item.id}`,sourceStatus:'verified',links,process:null,outcomes:null,sections:sections[slug].map(([heading,body],i)=>({heading,body,asset:`${slug}-prototype-${i+1}`,source:slug==='budgie'?'User-supplied Figma implementation specification':source.url})),assets:{logo:`${slug}-logo`,hero:`${slug}-hero`,...(slug==='budgie'?{closing:'budgie-closing'}:{})}};
});
for(const [slug,title,category] of [['after-taste',pair('After Taste','أفتر تيست'),pair('Behavior · Product concept','سلوك · فكرة منتج')],['dailys',pair('Dailys','ديليز'),pair('Social · Product concept','تواصل اجتماعي · فكرة منتج')]])projects.push({slug,title,category,type:category,headline:title,description:null,role:null,tools:[],deliverables:null,overview:null,process:null,outcomes:null,links:[],sections:[],assets:{logo:`${slug}-logo`,hero:`${slug}-hero`,...(slug==='budgie'?{closing:'budgie-closing'}:{})},sourceUrl:null,sourceStatus:'not-listed',contentNotice:pair('Project details are being prepared.','تفاصيل المشروع قيد الإعداد.')});
export default ['budgie','after-taste','gareeb','qamareya','day-diamond','dailys'].map(slug=>projects.find(p=>p.slug===slug));
