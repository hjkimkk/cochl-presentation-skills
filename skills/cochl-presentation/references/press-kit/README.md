# Cochl — Press / Media Kit

A **5-page press/media kit document** in the Cochl brand — the packet a journalist, partner, or event organizer receives. Editable SVG, Letter portrait (**612×792**), print/PDF-ready. Distinct from the **Social Media Banner Kit** (`../social-kit/`, platform banners); this is the multi-page document.

**Editable Figma source (Cochl_Internal):** https://www.figma.com/design/ZNt6fgUANTjRPk6GpgxODH/Cochl-Media-Kit — all 5 pages as editable frames (live text, gradient `cochl.` logo, indigo→purple blocks, image drop-zones). Prefer editing/duplicating this Figma file for a real kit; the `templates/` SVGs below are the offline mirror and the source these frames were imported from (identical layout/coords).

Inherits [`../brand-core.md`](../brand-core.md), with a **light** print treatment (white/​`#EEF2FF` panels, `#0F1B3D` ink) instead of the dark deck theme. Signature Cochl elements: the gradient `cochl.` logo (gradient disc symbol + wordmark — black on light pages, white on the cover photo), indigo `#4B68FF`→purple `#832BFB` accent blocks (replacing the reference's orange), a right-edge vertical **MEDIA KIT** spine, and a gradient-disc corner mark.

## Pages (`templates/`)
| # | Page | Contents |
|---|---|---|
| 1 | `cochl-media-kit_1-cover.svg` | Full-bleed cover photo (drop-zone) + top scrim, white logo, gradient **MEDIA KIT** spine, title + "Creating ears for AI". |
| 2 | `cochl-media-kit_2-contents.svg` | Table of contents (01 About Cochl · 02 In the Press · 03 Contact Us) — each item is pages 3–5's own header, verbatim. |
| 3 | `cochl-media-kit_3-about.svg` | "ABOUT COCHL" + factual company paragraph, side image drop-zone, stats band + "NOTABLE CLIENTS". |
| 4 | `cochl-media-kit_4-press.svg` | "IN THE PRESS" — two testimonial/quote blocks (headshot drop-zone + gradient quote panel). |
| 5 | `cochl-media-kit_5-contact.svg` | "CONTACT US" — press email, downloadables, social. |

`previews/` holds a 2× PNG of each page.

## Layers / edit points
- **Text** — every heading/label/body line is a live `<text>` (IBM Plex Sans/Mono). Swap copy in place.
- **Image drop-zones** — `image-*` groups (hatch + corner ticks + caption). Delete the placeholder and drop an `<image>` at the same x/y/w/h.
- **Logo** — the `logo` group: gradient disc symbol + wordmark. Keep the gradient symbol; wordmark is black on light pages, white on the cover.
- **Accent blocks / spine / mark** — `url(#ig)` indigo→purple; keep as the brand accent.
- **Inner spine label** — the vertical breadcrumb on pages 2–5, drawn by the shared `innerSpine(label)` helper (thin rule + vertical page label + "MEDIA KIT" + gradient-disc mark). `label` is that page's own short breadcrumb — `CONTENTS`, `ABOUT`, `PRESS`, `CONTACT` — passed explicitly at each call site, never a shared constant.

## Facts discipline (hard rule)
Anything unconfirmed is marked **`[NEEDS INPUT]`** and must be replaced with confirmed data before publishing: the About stats (numbers), Notable Clients, press quotes + attributions, the press email (`press@cochl.ai` is a placeholder — confirm), and social handles. The About paragraph is written from Cochl's general public positioning (sound AI) — verify before external use. Never fabricate metrics, client names, or quotes.

## Regenerate
`gen-presskit.mjs` (Node, no deps) emits all 5 pages; the embedded `cochl.` logo is inline vector. Render previews with headless Chrome at 2× (`--window-size=612,792 --force-device-scale-factor=2`).

**Guard — no hardcoded spine labels.** `innerSpine(label)` takes each page's breadcrumb as an explicit argument; it has no default and must never fall back to a literal placeholder string (e.g. `'SUBTITLE'`) or reuse another page's value. Every call site sets its own: page 2 `'CONTENTS'`, page 3 `'ABOUT'`, page 4 `'PRESS'`, page 5 `'CONTACT'` (the cover, page 1, doesn't use this helper — it has its own full-width spine). Before shipping or regenerating, grep every emitted `pages/*.svg` for the literal string `SUBTITLE` — any match means a page's spine label was never substituted, and this bug reproduces silently (`innerSpine()` still renders fine with a missing argument — `label` is simply `undefined` in the output — so no error surfaces).

**Guard — TOC entries must 1:1 match the pages they name.** Page 2's `items` array is the table of contents; each entry's label must be copied verbatim from the page-3–5 header it points to (`'About Cochl'` → page 3, `'In the Press'` → page 4, `'Contact Us'` → page 5), never an invented topic summary or a label that folds two pages into one line. Before shipping or regenerating, check `items` against the actual `header(...)`/title calls on pages 3–5: same count, same order, same wording. A TOC item with no matching page (or a page with no TOC entry) reproduces silently — the SVG still renders fine, nothing errors — so this can only be caught by reading the two side by side.
