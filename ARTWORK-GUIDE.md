# Your drawings, your gallery

Edit **assets/js/artwork.js** to point at your exported artwork. Everything already has a working placeholder; you can replace one item at a time.

| Asset | Recommended export | Notes |
| --- | --- | --- |
| Telephone | Transparent GIF, roughly 760 × 580 | Set `telephone` to its path. Keep its visible shape inside the canvas. The CSS wiggle switches off for GIFs. |
| Still telephone | Transparent PNG or SVG, same canvas | Set `telephoneStill`. This version appears when a visitor prefers reduced motion. |
| Three frames | Transparent PNG or SVG, 1200 × 1020 | Match the proportions of the supplied 400 × 340 SVGs. The clear opening is x=120, y=120, width=960, height=780 at 3× resolution. Keep both the opening and outside transparent. |
| Logo | Transparent SVG or PNG, square | Displayed at 40 × 40, 32 × 32 on mobile. Keep the name next to it readable. |
| Custom icons | SVG or transparent PNG, square | Five slots: arrow, design, code, identity, mail. Simple readable strokes work best at 24–32px. |
| Project paintings | WebP or PNG, preferably 960 × 780 | Existing Budgie and Gareeb visuals are used. Optional `projectArtwork` slots replace Qamareya and Day Diamond illustration placeholders. |

Put your files in `assets/illustrations/` with simple filenames. For example:

```js
telephone: '/assets/illustrations/ruba-phone.gif',
telephoneStill: '/assets/illustrations/ruba-phone-still.png',
frames: [
  '/assets/illustrations/my-frame-1.png',
  '/assets/illustrations/my-frame-2.png',
  '/assets/illustrations/my-frame-3.png'
],
```

The three frame styles are shuffled across projects once per tab, with all three represented. Moving between Gallery and About does not reshuffle them. A newly opened tab may produce a different arrangement.

The phone sits in the layout beside the gallery guide; it never floats over a project. Mobile visitors swipe the wall horizontally or use the previous/next buttons. Every painting is an ordinary link to the existing case study, and About is also accessible through the navigation. On mobile, Background and Services use accessible tabs with contact always below; without JavaScript both sections remain readable.

## Other optional artwork

- Qamareya and Day Diamond cover illustrations: add their paths in `projectArtwork`.
- Social sharing image: replace `assets/images/og-ruba.png` to match your final museum identity (1200 × 630).
- Browser tab icon: replace `favicon.svg` and `favicon-64.png` with your mark.
- A wall texture: optional; keep it faint so labels retain good contrast. The current wall is CSS with no image dependency.

All content stays usable without JavaScript: the links, project art, default frames, and About page are rendered as HTML. JavaScript adds random frame assignments, language switching, editable artwork paths, and mobile gallery controls.

## Preview

Run `python -m http.server 8000` from the repository, then open `http://localhost:8000`. Test the site at mobile width and in Arabic after replacing your files. Use versioned filenames for updated artwork because the hosting configuration caches assets for one year.
