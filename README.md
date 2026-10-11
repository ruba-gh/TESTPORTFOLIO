# Ruba Alghamdi — Portfolio

A quiet, bilingual portfolio with image-led case studies and a shared visitor note wall. Static HTML/CSS and small browser scripts; a Netlify Function provides the note wall API.

## Run and verify

- `npm ci` installs the server dependency.
- `npm test` runs the note wall API tests.
- `npx netlify dev` serves the site and a local Netlify Blobs store.
- An ordinary static server previews the design, but the note wall requires the function API.

## Deploy

Connect the repository to Netlify using `netlify.toml`. Netlify detects and bundles `netlify/functions/notes.mjs`; the API is `/api/notes`. Production notes use a site-wide `portfolio-visitor-notes` store with strong consistency. Deploy previews use `portfolio-visitor-notes-preview`, separate from production.

The note deletion password defaults to the requested **4321** and can be changed through `WALL_DELETE_PASSWORD` in Netlify. It is checked on the server. Function rate limiting is 30 requests per minute per IP/domain, and input is bounded. Notes are plain text, rendered with `textContent`.

The contact form remains configured for Netlify Forms. Form delivery, domain/TLS and the shared wall must be verified on the real deployment before claiming it is launch-ready.

## Content and images

English and Arabic strings are under `locales/`. Rubik is used for body text; the supplied Digi Cholak font is used for headings. See [ARTWORK-GUIDE.md](ARTWORK-GUIDE.md) for classifying projects, adding carousel images, replacing placeholders and operating the wall.

No analytics, advertising, tracking pixels, fabricated testimonials, or fabricated product screenshots are included.
