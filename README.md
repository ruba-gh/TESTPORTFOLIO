# Ruba Alghamdi Portfolio — Production Build

Static, server-renderable HTML/CSS with minimal JavaScript and no runtime framework dependency.

## Deployment target
This package is configured for Netlify so the contact form uses Netlify Forms without client-side API secrets. Deploy the folder as the publish directory, connect `rubalghamdi.com`, then enable form submission notifications for `rub.gmd23@gmail.com`. If you deploy to a different provider, replace the form backend and re-review the privacy/cookie wording before publication.

## Intentional decisions
- No analytics, ads, pixels, social embeds or non-essential cookie code.
- No cookie banner in the configured build.
- No LocalBusiness/ProfessionalService schema: business registration/address/telephone/opening-hours details were not sufficiently verified, and inventing them would be misleading. Person + CreativeWork + BreadcrumbList schemas are used instead.
- Qamareya and Day Diamond cards use CSS editorial artwork rather than fabricated UI screenshots when a publishable source image was not available in the retrieved project assets.
- No anonymous testimonial quotes or unsupported metrics were carried over from the old site.

## External launch gates
The code package is complete, but the site must not be called publicly launch-ready until the actual deployment is verified: custom-domain/DNS activation; TLS/HTTPS; Netlify form delivery; hosting/form processor alignment with the Privacy Policy; project-image publication rights; and a final crawl of the deployed canonical URLs. These cannot be truthfully completed inside this local build environment.

## Localization and mobile update

- English and Arabic copy are centralized under `/locales/en.js` and `/locales/ar.js`.
- The language preference persists with `localStorage`; Arabic switches the shared interface to RTL without duplicating pages.
- Mobile navigation collapses below 900px into an accessible side drawer with focus trapping, Escape-to-close, overlay close, scroll lock, and focus return.
- Project detail pages no longer contain previous/next project navigation; they end with a simple Back to Projects action.
- The home hero uses a locally generated, non-AI abstract blue motion texture (`/assets/video/hero-bg.webm` with MP4 fallback). It is intentionally deferred on desktop and replaced by its static poster on mobile and for `prefers-reduced-motion` users.
