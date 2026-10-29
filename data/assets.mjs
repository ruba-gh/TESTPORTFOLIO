import projects from './projects.mjs';
// Set src to an approved local asset path to show a real image. Reference URLs are
// provenance only: they never render, load or download. Alt remains meaningful.
export const assets={
 hands:{src:'/assets/images/Hands.png',loading:'eager',alt:'Two open hands in pastel lavender sleeves',ratio:'1440 / 1000',background:'hero',radius:'none'},
 // The hero rises into lavender; the closing mist flows down behind the laptop.
 head:{src:'/assets/images/head%20image.png',loading:'eager',alt:'Star-filled organic mist rising from a lavender base between the hands',ratio:'3470 / 1975',background:'clear',radius:'none'},
 mist:{src:'/assets/images/bottom%20image.png',alt:'Inverted star-filled mist flowing from lavender into the contact section',ratio:'3470 / 2129',background:'clear',radius:'none'},
 computer:{src:'/assets/images/image%206.png',alt:'Blue laptop with a pastel lavender screen',ratio:'2880 / 2048',background:'computer',radius:'soft'}
};
// Project artwork is edited alongside its bilingual content in projects.json.
export function registerProjectAssets(records){
for(const p of records){
 assets[p.assets.logo]=p.images.logo;
 assets[p.assets.hero]=p.images.hero;
 if(p.assets.closing)assets[p.assets.closing]=p.images.closing;
 for(const section of p.sections)assets[section.asset]=section.image;
}

}
registerProjectAssets(projects);

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
