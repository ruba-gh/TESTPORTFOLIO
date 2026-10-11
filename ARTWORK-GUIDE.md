# Portfolio artwork and typography

The site now uses a restrained off-white, charcoal and teal palette. Yellow, peach and blue are reserved for the public note wall. Body copy uses the supplied **Digi Cholak** font; headings use the existing self-hosted **Rubik** at weight 600. The supplied font attribution/licensing note is retained as `assets/fonts/Digi-Cholak-source.txt`.

## Image-led project pages

Existing Budgie and Gareeb images are preserved and displayed uncropped at full width, immediately after the short project introduction. Qamareya and Day Diamond explicitly show placeholders until final screens are supplied.

Add your images to `assets/images/`, then edit `assets/js/project-media.js`:

```js
qamareya: {
  cover: '/assets/images/qamareya-cover.webp',
  gallery: [
    { src: '/assets/images/qamareya-flow.webp', alt: 'Cycle tracking flow', caption: 'From overview to detail.' },
    { src: '/assets/images/qamareya-screens.webp', alt: 'Final interface screens' }
  ]
}
```

Use WebP for lightweight images, preserve the original image proportions, and avoid screenshots containing private information. A `cover` replaces the project card art and the placeholder on its detail page; gallery images appear before the supporting project story. On mobile, the story is a single expandable section so the artwork takes priority. A `cover` also replaces the existing Budgie or Gareeb cover when supplied.

## Shared visitor wall

- The home page shows four notes; `/wall/` shows the most recent 100 with a More notes button.
- Visitors can post a 280-character message, optional name and paper color.
- Hold a note for 650ms to reveal the small ×. Click × and enter **4321** to delete.
- Keyboard users can hold Space, or use Shift+F10 on a focused note to reveal ×.
- The password is verified in the Netlify Function, not by client JavaScript. Set `WALL_DELETE_PASSWORD` in Netlify if changing it later.
- Netlify Blobs persists production notes across visitors and deployments. Deploy previews use a separate shared preview store.
- Errors never pretend a note was saved. No localStorage-only guestbook fallback is used.
- The privacy page explains that names and messages are public.

Netlify installs the `@netlify/blobs` dependency and bundles `netlify/functions/notes.mjs` automatically. No separate database key is needed. The wall requires Netlify hosting; an ordinary static file server cannot provide it. `npm test` checks server-side posting, shared reads, password enforcement, invalid inputs and concurrent writes. Use `npx netlify dev` for a local wall with Netlify's development storage.

Optional future drawings: a simple brand mark, custom service icons, project cover art, social sharing image (1200×630), and favicon. The site works without adding any of them. Use versioned filenames for changed artwork because `/assets/*` is cached for one year.
