# Edit the portfolio

The current static HTML/CSS/JavaScript and Netlify deployment setup is retained. One reusable template builds every project URL from `data/projects.json`. You never need to copy or edit a project's generated HTML.

## Add a project

1. Run `npm run project:add -- my-project apps` or `npm run project:add -- my-website websites`.
2. Open the new record at the bottom of `data/projects.json`. It starts with `"draft": true`, so unfinished example content is not listed in the grids or generated as a detail page.
3. Edit its English and Arabic fields, color, artwork and features. Set `draft` to `false` when ready.
4. Run `npm run build` and `npm test`, then commit the data and generated changes. Netlify runs the same build using the existing publish directory and functions.

The route is generated from `slug`: `my-project` becomes `/projects/my-project/`. `collection` places its icon on the Apps or Websites page automatically. Array order controls icon order. Setting a project back to draft or removing its record removes its generated route on the next build. Slugs must be unique lowercase words separated by hyphens.

## Change a project's color

Every project has its own `accent`, for example `"accent": "#6FAFCD"` for Budgie. This colors only that project's introduction and closing sections. Other projects keep their own colors. Readable light or dark text is chosen automatically. The feature sections retain their light/dark backgrounds; an individual feature can optionally set `"theme": "light"` or `"theme": "dark"`.

## Add, remove or reorder features

Edit the project's `features` array. There is no fixed feature count: `[]`, one feature, or five features all work. Copy an existing feature, edit both translations and its image, or delete a feature object. Desktop image positions alternate automatically; mobile keeps each feature's text directly before its image.

```json
{
  "heading": {"en": "A feature heading", "ar": "عنوان الميزة"},
  "body": {"en": "Describe this feature.", "ar": "أضف وصف هذه الميزة."},
  "image": {
    "src": "/assets/images/my-project/feature.png",
    "alt": {"en": "What the image shows", "ar": "وصف ما تعرضه الصورة"},
    "ratio": "4 / 5"
  }
}
```

## Edit English and Arabic together

Each text field keeps its translations next to each other: `{ "en": "…", "ar": "…" }`. Edit either value directly in `data/projects.json`. This includes names, categories, headlines, descriptions, feature headings/body text, roles, deliverables, link labels and image alt text. Use `\n` inside a string for a deliberate line break.

Translations are scoped to their field, so two features may use the same English heading and different Arabic text. Switching languages updates copy, image descriptions, project page titles and metadata while retaining the selected work page and RTL behavior. The build reports missing English/Arabic text rather than silently publishing incomplete translations. Shared Apps/Websites labels and their empty-state text live in `data/work-pages.json`.

Optional content such as `overview`, `role`, `deliverables` or the closing mockup can be `null`; `tools` and `links` may be empty arrays. Keep supported claims and source links accurate. A link uses `{ "label": {"en":"View website ↗","ar":"عرض الموقع ↗"}, "url":"https://…" }`.

## Add artwork

All **project** artwork is edited in the same project record:

- `images.logo`: icon shown in its Apps/Websites grid.
- `images.hero`: main project mockup.
- `images.closing`: optional bottom mockup; use `null` to omit it.
- `features[i].image`: the image beside that feature.

Use local `/assets/…` paths. Use `src: null` to keep a visible `ALT` placeholder. An image that fails to load also returns to ALT. Image settings support `ratio`, optional `width`/`height`, `background` (a named variant or hex), and `radius` (a named variant, px or %). Original image `references` are provenance only and never render or download. Images are contained to show the full artwork.

Budgie's two mockups and three feature images remain linked. Homepage hands, starfield transitions, laptop, and preserved utility-page visuals are configured separately in `data/assets.mjs`. Their source artwork is unchanged.

## Work-page controls

The compact Apps/Websites labels above the grid are both titles and controls. Visitors can click, swipe or use arrow keys/Home/End. There is no autoplay. The active page stays selected when switching languages or resizing; offscreen links do not enter keyboard focus. Both the homepage and `/projects/` use the same component and project data.

There are currently six app entries and no supplied website entries. The Websites page shows an honest empty state until a published project uses `"collection": "websites"`. No website case studies have been invented.

## Source coverage and preserved functionality

`data/portfolio-source.json` preserves the original Arabic/English records retrieved from rubalghamdi.com on 12 October 2026. Budgie, Gareeb, Qamareya and Day Diamond retain their descriptions, roles, tools, deliverables and prototype/PDF/App Store links where available. After Taste and Dailys were not listed; only the supplied names/categories and a preparation notice are used. No additional outcomes or responsibilities were invented. Budgie's SMS/Shortcuts and onboarding narrative was supplied in the implementation brief.

The existing contact form, visitor note wall and password-protected deletion, about/policy routes, language preference, RTL and Netlify functions remain available. Their content is preserved in `data/utility-pages.json`; legacy utility translations remain in `locales/`.

## Implementation and verification

- `data/projects.json`: editable project records, translations and project artwork.
- `data/projects.mjs` / `lib/site/project-data.mjs`: load, validate and normalize records.
- `lib/site/templates.mjs`: the shared detail-page template.
- `lib/site/components.mjs` / `lib/site/work-pages.mjs`: reusable layout components.
- `assets/js/work-pages.js`: native scroll paging, keyboard controls and RTL alignment.
- `scripts/build.mjs`: generate routes, accent CSS and legacy translations.

Run `npm run build`, `npm test` and `git diff --check`. Check desktop, tablet and phone widths, English/Arabic, project links and both work pages. Tests cover variable feature counts, independent colors, drafts, bilingual validation, field-scoped translations, uploaded images, and visitor-note persistence/deletion.
