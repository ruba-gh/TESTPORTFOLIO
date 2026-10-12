# Ruba Alghamdi — Portfolio

A fresh portfolio inspired by the supplied black-background, colored-tile reference. The layout uses a coordinated grid, warm colors, rounded forms, bold SVG icons and readable self-hosted Rubik typography. Tile spans follow the content: identity and featured work receive more space, while navigation and services stay compact.

## Preview

Run `python -m http.server 8000` from the repository and open `http://localhost:8000`. There is no build step or runtime framework dependency. Netlify publishes the repository root using `netlify.toml`.

Home links directly to the four existing projects, About, Contact and services. Projects uses a focused artwork grid; About carries the same tile vocabulary. Project pages use genuine supplied images and concise supporting copy. Qamareya and Day Diamond retain clearly identified missing-visual states, rather than fabricated screenshots.

## Content and artwork

- Shared English/Arabic strings: `locales/en.js` and `locales/ar.js`.
- Design tokens, tile grid, page layouts and responsive rules: `assets/css/tiles.css`.
- Consistent icon family: `assets/icons/`.
- Optional cover replacements and additional real project images: `assets/js/project-media.js`.
- See [ARTWORK-GUIDE.md](ARTWORK-GUIDE.md) for customization.

The previous note wall, password API, category filters, handwritten font, museum graphics and hero video are removed from the active site. Old `/wall/` links redirect to Home. No external visitor data was deleted.

The contact form retains Netlify Forms support. Live form delivery, domain/TLS and deployment must be verified on Netlify before claiming the site is launch-ready. There is no analytics, advertising or fabricated testimonial content.
