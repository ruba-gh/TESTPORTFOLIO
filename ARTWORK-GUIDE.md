# Projects, images and notes

## Typography and layout

Body copy now uses self-hosted Rubik at regular weight. Headings use the supplied Digi Cholak font. The supplied font source note is retained as `assets/fonts/Digi-Cholak-source.txt`. Decorative eyebrow labels and layout divider rules have been removed.

## Homepage categories

Home and Projects have three filters: **UX/UI**, **Design**, and **Websites**. Current documented projects are UX/UI. Other filters show clear empty states until actual projects are added.

To classify a project card, edit its `data-category` attribute in `index.html` and `projects/index.html`:

```html
<a class="work-card" data-category="design" href="/projects/my-brand/">...</a>
<a class="work-card" data-category="websites" href="/projects/my-website/">...</a>
```

A project may belong to more than one category: `data-category="ux-ui websites"`. Filters work with mobile swiping and arrow controls. The selected category is kept in the URL so reloads and copied links return to the same view.

## Project image carousel

Each detail page uses one bounded carousel, not a large image filling the page. It supports touch scrolling, previous/next buttons, keyboard arrows/Home/End, a position indicator and direct image dots. Click a genuine image to open it at full size. There is no automatic rotation.

The existing cover is the first slide. Additional visuals are configured in `assets/js/project-media.js`. Budgie currently has one supplied visual, Gareeb has two; additional slides are clearly labeled placeholders. Qamareya and Day Diamond also retain placeholders until final screens are supplied.

Put your images in `assets/images/`, then replace placeholder entries:

```js
budgie: {
  cover: null, // Optional new cover, also used on the project card.
  gallery: [
    { src: '/assets/images/budgie-research.webp', alt: 'Budgeting research insights', caption: 'Research & process' },
    { src: '/assets/images/budgie-screens.webp', alt: 'Final budget interface screens', caption: 'Interface details' }
  ]
}
```

Use WebP where possible, keep each image's original proportions, and write useful alt text. A `cover` path replaces the first slide and the project card artwork. Add as many gallery entries as the project needs; the carousel discovers its length automatically. The supporting project story is expandable on mobile so images get priority.

## Shared sticky-note wall

- Home shows four notes; `/wall/` shows the most recent 100 with More notes pagination.
- Visitors post up to 280 characters, an optional name and a paper color.
- Hold a note for 650ms to reveal ×. Click × and enter **4321** to remove it.
- Keyboard users can hold Space or press Shift+F10 on a focused note.
- The password is verified server-side; change `WALL_DELETE_PASSWORD` in Netlify to change it.
- Production notes persist in Netlify Blobs across visitors and deployments; previews use a separate store.
- Failed saves retain the draft. There is no localStorage-only guestbook fallback.

Run `npm test` for the API tests. Use `npx netlify dev` to preview with development storage. The wall requires Netlify; an ordinary static server previews layouts but cannot provide shared persistence. The real deployment must be checked before claiming live storage or contact form delivery is verified.

Use versioned asset filenames for updates because assets are cached for one year.
