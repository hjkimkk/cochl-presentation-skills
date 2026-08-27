# Cochl — Press / Media Kit

A **5-page press/media kit document** in the Cochl brand — the packet a journalist, partner, or event organizer receives. Editable SVG, Letter portrait (**612×792**), print/PDF-ready. Distinct from the **Social Media Banner Kit** (`../social-kit/`, platform banners); this is the multi-page document.

Inherits [`../brand-core.md`](../brand-core.md), with a **light** print treatment (white/​`#EEF2FF` panels, `#0F1B3D` ink) instead of the dark deck theme. Signature Cochl elements: the gradient `cochl.` logo (gradient disc symbol + wordmark — black on light pages, white on the cover photo), indigo `#4B68FF`→purple `#832BFB` accent blocks (replacing the reference's orange), a right-edge vertical **MEDIA KIT** spine, and a gradient-disc corner mark.

## Pages (`templates/`)
| # | Page | Contents |
|---|---|---|
| 1 | `cochl-media-kit_1-cover.svg` | Full-bleed cover photo (drop-zone) + top scrim, white logo, gradient **MEDIA KIT** spine, title + "Creating ears for AI". |
| 2 | `cochl-media-kit_2-contents.svg` | Table of contents (01 About · 02 Traction & Recognition · 03 Contact & Press). |
| 3 | `cochl-media-kit_3-about.svg` | "ABOUT COCHL" + factual company paragraph, side image drop-zone, stats band + "NOTABLE CLIENTS". |
| 4 | `cochl-media-kit_4-press.svg` | "IN THE PRESS" — two testimonial/quote blocks (headshot drop-zone + gradient quote panel). |
| 5 | `cochl-media-kit_5-contact.svg` | "CONTACT US" — press email, downloadables, social. |

`previews/` holds a 2× PNG of each page.

## Layers / edit points
- **Text** — every heading/label/body line is a live `<text>` (IBM Plex Sans/Mono). Swap copy in place.
- **Image drop-zones** — `image-*` groups (hatch + corner ticks + caption). Delete the placeholder and drop an `<image>` at the same x/y/w/h.
- **Logo** — the `logo` group: gradient disc symbol + wordmark. Keep the gradient symbol; wordmark is black on light pages, white on the cover.
- **Accent blocks / spine / mark** — `url(#ig)` indigo→purple; keep as the brand accent.

## Facts discipline (hard rule)
Anything unconfirmed is marked **`[NEEDS INPUT]`** and must be replaced with confirmed data before publishing: the About stats (numbers), Notable Clients, press quotes + attributions, the press email (`press@cochl.ai` is a placeholder — confirm), and social handles. The About paragraph is written from Cochl's general public positioning (sound AI) — verify before external use. Never fabricate metrics, client names, or quotes.

## Regenerate
`gen-presskit.mjs` (Node, no deps) emits all 5 pages; the embedded `cochl.` logo is inline vector. Render previews with headless Chrome at 2× (`--window-size=612,792 --force-device-scale-factor=2`).
