import projects from './projects.mjs';
// Set src to an approved local asset path to show a real image. Reference URLs are
// provenance only: they never render, load or download. Alt remains meaningful.
export const assets={
 hands:{src:null,alt:'Two hands entering from the upper corners and spreading lavender mist downward',ratio:'1440 / 1000',background:'hero',radius:'none'},
 mist:{src:null,alt:'Lavender mist fading into charcoal between the process and contact sections',ratio:'1440 / 350',background:'mist',radius:'none'},
 computer:{src:null,alt:'A computer with its screen centered beneath the contact heading',ratio:'1120 / 800',background:'computer',radius:'soft'}
};
for(const p of projects){
 const refs=(p.images||[]).map(i=>({url:new URL(i.src,'https://rubalghamdi.com/').href,alt:i.alt}));
 assets[p.assets.logo]={src:null,alt:`${p.title.en} app logo`,ratio:'1 / 1',background:'logo',radius:'logo',references:[]};
 assets[p.assets.hero]={src:null,alt:`${p.title.en} portrait product prototype`,ratio:'4 / 5',background:'green',radius:'soft',references:refs};
 for(let i=1;i<=3;i++)assets[`${p.slug}-prototype-${i}`]={src:null,alt:`${p.title.en} prototype illustrating ${p.sections[i-1]?.heading.en.replaceAll('\n',' ')||'project screens'}`,ratio:'640 / 520',background:i===2?'dark':'light',radius:'soft',references:refs};
}

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
