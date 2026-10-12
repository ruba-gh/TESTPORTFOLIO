# Color-tile portfolio guide

## Direction

The uploaded reference informed the black canvas, warm flat colors, rounded tiles and bold black symbols. The design-reference guide informed the consistent motif family, deliberate content hierarchy, purposeful tile spans and separate verification of mobile and Arabic layouts.

The actual tokens are in `assets/css/tiles.css`. Coral introduces Ruba, lilac supports personal context, yellow marks contact/navigation, and each project has an assigned color. Rubik is self-hosted; Arabic uses suitable system fallbacks where the font lacks glyphs.

## Homepage

`index.html` uses a four-column desktop grid and a two-column phone grid. Identity and Budgie span two columns because their text and imagery need more room. Every navigational tile is a normal link; hover effects respect reduced motion. There are no filters, note-wall features or randomized decorations.

Edit project names and descriptions in both `index.html` and `projects/index.html`. Keep captions concise; let the work and color carry the identity. Add new projects using the same tile classes and an actual project URL. Keep the same icon geometry instead of introducing unrelated doodles or emoji.

## Real project images

Budgie and Gareeb use the supplied repository images. Qamareya and Day Diamond use conceptual cover symbols, and their detail pages explicitly identify missing final visuals. Do not replace these with invented app screenshots.

Put additional images in `assets/images/` and edit `assets/js/project-media.js`:

```js
budgie: {
  cover: '/assets/images/budgie-cover.webp',
  gallery: [
    { src: '/assets/images/budgie-process.webp', alt: 'Budget research insights', caption: 'Research & process' },
    { src: '/assets/images/budgie-screens.webp', alt: 'Final budget interface screens', caption: 'Interface screens' }
  ]
}
```

A cover replaces the first project-page image and its homepage card image, including conceptual cover symbols. Gallery entries appear in the project's image area with accessible controls only when multiple visuals are present. Genuine images open at native size when clicked. Keep each image's original proportions and use descriptive alt text.

## Localization and contact

Add Arabic equivalents for new text in `locales/ar.js`. Check long Arabic titles at phone width, and keep directional arrows meaningful in RTL. The shared language switch persists the visitor's choice.

Contact uses Netlify Forms, with inline errors and native validation. Verify actual delivery on the deployed site; a local static preview can only test the user interface.

Use versioned filenames when replacing cached assets. The retired note-wall source and API are removed from this build; existing remote stored notes were not modified.
