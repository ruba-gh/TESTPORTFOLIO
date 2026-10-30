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

English and Arabic strings are under `locales/`. Rubik is used for body text; Zain Rounded is used for Arabic headings and Caprasimo for English headings. See [ARTWORK-GUIDE.md](ARTWORK-GUIDE.md) for classifying projects, adding carousel images, replacing placeholders and operating the wall.

No analytics, advertising, tracking pixels, fabricated testimonials, or fabricated product screenshots are included.

## Inner page layouts and process icons

About, Contact, Terms and Privacy are rendered by `lib/site/utility-pages.mjs` and styled with `assets/css/utility-pages.css`, using the homepage palette and bilingual heading fonts. Existing policy paragraphs and the Netlify contact form are retained.

Add `01-understand.svg`, `02-explore.svg` and `03-refine.svg` to `assets/illustrations/` (or another project directory), then run the build. `lib/site/process-icons.mjs` finds these exact filenames automatically. Missing uploads produce a build warning and keep the existing SVG as a fallback.


### Contact form delivery

The form uses Netlify Forms, not SMTP in the browser. To activate delivery:

1. In the Netlify project for TESTPORTFOLIO, open **Forms** and **Enable form detection**.
2. Redeploy the site after enabling detection. Confirm the `contact` form appears in Forms. Netlify removes `data-netlify` from the deployed form when it registers it; the browser refuses to claim success for an unregistered form.
3. In **Forms > Submission notifications**, add an **Email notification** for `contact` to `rub.gmd23@gmail.com`.
4. Submit a real inquiry, confirm it appears under verified submissions, and confirm the email arrives (check spam too). A local mocked response cannot verify inbox delivery.

The AJAX POST uses the form's `/contact/` action and keeps field values when delivery fails. The email field supplies the notification's Reply-to address.

References: https://docs.netlify.com/manage/forms/setup/ and https://docs.netlify.com/manage/forms/notifications/
