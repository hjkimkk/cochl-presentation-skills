# Cochl — Press / Social Media Kit

Editable banner templates in the Cochl brand (near-black `#0b0b12`, indigo `#4B68FF` → purple `#832BFB` glow, gradient `cochl.` symbol + white wordmark, IBM Plex).

Each template ships as an **editable SVG** (real `<text>`, layered `<g>` groups — open in Illustrator/Figma/Inkscape and swap copy) plus a **1× PNG** preview.

| File | Platform | Size (px) | Notes |
|---|---|---|---|
| `cochl-linkedin-banner-1584x396` | LinkedIn profile / company cover | 1584 × 396 | Keep key content clear of the lower-left avatar area on personal profiles. |
| `cochl-youtube-channel-2560x1440` | YouTube channel art | 2560 × 1440 | All content sits inside the **1546 × 423 safe area** (shown as a dashed `guides` layer — delete it before export). |
| `cochl-medium-banner-1500x750` | Medium / blog header | 1500 × 750 | 2:1 editorial cover. |
| `cochl-notion-cover-1500x600` | Notion page cover | 1500 × 600 | Notion crops top & bottom; content is held in the central band. |
| `cochl-og-social-card-1200x630` | Open Graph / X / general share card | 1200 × 630 | Default link-preview card for any platform. |

## Editing
- **Text** — every headline/label is a live `<text>` element. Change the wording, font stays IBM Plex Sans / Mono.
- **Layers** — `bg`, `glow-layer`, `brand`, `tag`/`foot`/`guides`. Select a group to move, recolor, or delete it.
- **Logo** — the `logo` group holds the gradient symbol + white wordmark; scale it as a unit.
- **Colors** — swap the `cochlGrad` / `glow` gradient stops in `<defs>` to retune the brand glow.

## Blank templates → `templates/`
Like the brochure library, `templates/` holds an **empty** version of each format — logo + glow + **image drop-zones** + dim **text placeholders**, nothing else filled in.

| Blank template | Size | Slots |
|---|---|---|
| `templates/linkedin-1584x396--blank.svg` | 1584 × 396 | headline · subtitle · 1 image (right) |
| `templates/youtube-channel-2560x1440--blank.svg` | 2560 × 1440 | headline · subtitle · full-bleed bg image · safe-area guide |
| `templates/medium-banner-1500x750--blank.svg` | 1500 × 750 | 2-line headline · subtitle · hero image (right) |
| `templates/notion-cover-1500x600--blank.svg` | 1500 × 600 | title · cover image (right) · visible-band guide |
| `templates/og-social-card-1200x630--blank.svg` | 1200 × 630 | headline · subtitle · full-bleed bg image |

**How to fill:**
1. Pick the format's blank SVG.
2. Replace each `#565b6b` placeholder `<text>` with real copy (font/size/position already set).
3. Drop artwork into an `image-*` group: delete the placeholder rect/hatch/ticks/caption and place your `<image>` (or a photo frame) at the same x/y/w/h.
4. Delete the `layer-guides` group before exporting (YouTube / Notion only).
5. Keep the `logo` and `cochlGrad`/`glow` gradients as-is for brand consistency.

> Drop me the **context + images** and I'll fill a blank template into a finished banner — the filled examples in the kit root show the target result.

## Regenerate
`gen-social-kit.mjs` emits the filled examples; `gen-social-templates.mjs` emits the blank templates. Both are Node, no deps; PNGs render with headless Chrome at 1×.
