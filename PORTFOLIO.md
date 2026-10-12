# Portfolio editing and verification

This remains a static HTML/CSS/JavaScript site with the existing Netlify setup and note-wall function. `npm run build` renders the homepage and every project URL from one shared template. Generated HTML is committed so the site also works with ordinary static hosting and with JavaScript disabled. Netlify runs the same build before publishing; no deployment is performed by this change.

## Edit project content

- `data/projects.mjs`: ordered project list, bilingual content, narrative sections, roles, tools and external links.
- `data/portfolio-source.json`: complete original Arabic/English project records retrieved from the live portfolio on 12 October 2026. Preserve this snapshot as provenance rather than editing it.
- `lib/site/templates.mjs`: shared homepage and project layouts.
- `lib/site/components.mjs`: navigation, reusable asset slots, tiles, process steps, contact and narrative sections.
- `data/utility-pages.json`: preserved contact form, visitor wall, about and policy content, rendered with the new shared navigation/footer.

For a project with documented content, add sections containing `heading`, `body`, and `asset`. The shared template alternates image/text on desktop, then places each section’s text before its own prototype on mobile. Empty sections do not render. Add English/Arabic values together; the build registers new translations with the existing language runtime. The language preference and RTL behavior are preserved.

## Replace ALT slots

Edit `data/assets.mjs`. Every slot currently has `src: null`. Change only `src` to an approved local path and update `alt` with a meaningful description of the supplied image. `references` contains original image URLs for later use, but is never displayed, requested or downloaded. Slots support `ratio`, optional `width`/`height`, background variants, and radius variants. Dimensions are emitted as an external stylesheet to honor the existing content security policy. Mobile prototype and contact dimensions remain responsive.

All unfilled visual slots show exactly `ALT`. A supplied image that fails to load also returns to an accessible `ALT` slot. Interface headings and buttons remain ordinary HTML outside image slots. No original portfolio images, Figma exports or stock images are displayed by this redesign.

## Source coverage

The live homepage’s `js/home.js` links to `project.html?id=…`; its `js/project.js` renders details from `js/data.js`. Both scripts and all four linked page shells were inspected. The following content was available:

| Project | Live project ID | Preserved content |
| --- | --- | --- |
| Budgie | `budgie-budgeting-app` | Bilingual descriptions and overview; UX/UI role; Figma/SwiftUI; research, budget flow, screens and prototype deliverables; Figma prototype, presentation PDF and App Store links; original image references |
| Gareeb | `gareeb-delivery-app` | Bilingual descriptions and overview; UX/UI role; Figma; flow, service concept, screens and prototype deliverables; Figma/PDF links; image references |
| Qamareya | `qamareya-womens-health-app` | Bilingual descriptions and overview; UX/UI role; Figma; information architecture, flow, design system and screens; Figma/PDF links; image references |
| Day Diamond | `day-diamond-app` | Bilingual descriptions and overview; UX/UI role; Figma; research, flow, design system, screens and prototype; Figma/PDF links; image references |
| After Taste | Not listed | Name and category from the requested homepage specification only |
| Dailys | Not listed | Name and category from the requested homepage specification only |

After Taste and Dailys have working project URLs and share the same template, but show a preparation notice instead of fabricated case studies. Their three narrative asset definitions are ready for later content. No quantitative outcomes or additional responsibilities were available in the live data. `process` and `outcomes` remain null. Budgie’s SMS/Shortcuts, categorization and six-to-three onboarding narrative comes from the user-supplied implementation specification, recorded explicitly as its section source.

## Checks

Run `npm run build` and `npm test`. Verify `/`, `/projects/`, all six project URLs, `/about/`, `/contact/` and `/wall/` on desktop, tablet and phone. Check English/Arabic, keyboard focus, native section links, email/prototype links, form feedback, reduced motion and exact ALT labels. The visitor-wall tests exercise shared persistence, validation and password-protected deletion.
