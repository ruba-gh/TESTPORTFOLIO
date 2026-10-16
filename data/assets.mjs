import projects from './projects.mjs';
// Set src to an approved local asset path to show a real image. Reference URLs are
// provenance only: they never render, load or download. Alt remains meaningful.
export const assets={
 hands:{src:'/assets/images/Hands.png',loading:'eager',alt:'Two open hands in pastel lavender sleeves',ratio:'1440 / 1000',background:'hero',radius:'none'},
 // The uploaded filenames are reversed relative to the silhouettes in the reference.
 head:{src:'/assets/images/bottomimage.png',loading:'eager',alt:'Star-filled organic mist rising from a lavender base between the hands',ratio:'3470 / 1975',background:'clear',radius:'none'},
 mist:{src:'/assets/images/headimage.png',alt:'Inverted star-filled mist flowing from lavender into the contact section',ratio:'3470 / 1780',background:'clear',radius:'none'},
 computer:{src:'/assets/images/image%206.png',alt:'Blue laptop with a pastel lavender screen',ratio:'1120 / 800',background:'computer',radius:'soft'}
};
const projectIcons={budgie:'/assets/images/Budgie.png','after-taste':'/assets/images/Aftertaste.png',gareeb:'/assets/images/Gareeb.png',qamareya:'/assets/images/Qamareya.png','day-diamond':'/assets/images/Day%20Diamond.png'};
for(const p of projects){
 const refs=(p.images||[]).map(i=>({url:new URL(i.src,'https://rubalghamdi.com/').href,alt:i.alt}));
 assets[p.assets.logo]={src:projectIcons[p.slug]||null,alt:`${p.title.en} app logo`,ratio:'1 / 1',background:'logo',radius:'logo',references:[]};
 assets[p.assets.hero]={src:null,alt:`${p.title.en} portrait product prototype`,ratio:'4 / 5',background:'green',radius:'soft',references:refs};
 for(let i=1;i<=3;i++)assets[`${p.slug}-prototype-${i}`]={src:null,alt:`${p.title.en} prototype illustrating ${p.sections[i-1]?.heading.en.replaceAll('\n',' ')||'project screens'}`,ratio:'640 / 520',background:i===2?'dark':'light',radius:'soft',references:refs};
}

// Uploaded Budgie artwork, shared by the header, narrative sections and closing.
Object.assign(assets,{
 'budgie-hero':{...assets['budgie-hero'],src:'/assets/images/budgie/mockup1.png',loading:'eager',alt:'Angled iPhone displaying the Budgie launch screen',background:'clear',radius:'none'},
 'budgie-closing':{src:'/assets/images/budgie/mockup2.png',alt:'Angled iPhone displaying Budgie’s financial onboarding screen',ratio:'4 / 5',background:'clear',radius:'none'},
 'budgie-prototype-1':{...assets['budgie-prototype-1'],src:'/assets/images/budgie/featurepost1.png',alt:'Budgie spending categories with amounts and percentage breakdowns',background:'clear'},
 'budgie-prototype-2':{...assets['budgie-prototype-2'],src:'/assets/images/budgie/featurepost2.png',alt:'Budgie spending insights chart with daily, weekly and monthly views',background:'clear'},
 'budgie-prototype-3':{...assets['budgie-prototype-3'],src:'/assets/images/budgie/featurepost3.png',alt:'Budgie budget widgets displayed on iPhone lock screens',background:'clear'}
});

// Preserved utility-route visuals also use this central registry.
Object.assign(assets,{
  "about-visual-1": {
    "src": null,
    "alt": "about illustration",
    "ratio": "4 / 3",
    "background": "light",
    "radius": "soft",
    "references": [
      {
        "url": "/assets/illustrations/icon-design.svg"
      }
    ]
  },
  "about-visual-2": {
    "src": null,
    "alt": "about illustration",
    "ratio": "4 / 3",
    "background": "light",
    "radius": "soft",
    "references": [
      {
        "url": "/assets/illustrations/icon-code.svg"
      }
    ]
  },
  "about-visual-3": {
    "src": null,
    "alt": "about illustration",
    "ratio": "4 / 3",
    "background": "light",
    "radius": "soft",
    "references": [
      {
        "url": "/assets/illustrations/icon-identity.svg"
      }
    ]
  },
  "about-visual-4": {
    "src": null,
    "alt": "about illustration",
    "ratio": "4 / 3",
    "background": "light",
    "radius": "soft",
    "references": [
      {
        "url": "/assets/illustrations/icon-mail.svg"
      }
    ]
  }
});
