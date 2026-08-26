# Cochl — Press / Social Media Kit

Editable banner templates in the Cochl dark brand (near-black `#0b0b12`, indigo `#4B68FF` → purple `#832BFB` glow, gradient `cochl.` symbol + white wordmark, IBM Plex Sans / Mono).

Two sets:
- **`templates/`** — BLANK templates (image drop-zones + text placeholders). Start here; drop context + images to fill.
- **`examples/`** — FILLED reference banners (SVG + PNG) showing the target result.

## Formats

| Format | Size (px) | Blank template | Notes |
|---|---|---|---|
| LinkedIn cover | 1584 × 396 | `templates/linkedin-1584x396--blank.svg` | Keep key content clear of the lower-left avatar on personal profiles. |
| YouTube channel art | 2560 × 1440 | `templates/youtube-channel-2560x1440--blank.svg` | All content inside the **1546 × 423 safe area** (dashed `layer-guides` — delete before export). |
| Medium / blog header | 1500 × 750 | `templates/medium-banner-1500x750--blank.svg` | 2:1 editorial cover. |
| Notion page cover | 1500 × 600 | `templates/notion-cover-1500x600--blank.svg` | Notion crops top & bottom; content held in the central visible band. |
| OG / share card | 1200 × 630 | `templates/og-social-card-1200x630--blank.svg` | Open Graph / X / general link-preview card. |

## Layer structure (every template)
`layer-background` · `layer-graphic-elements` (glow) · `layer-images` (drop-zones) · `layer-logo` · `layer-text-content` · `layer-guides` (safe-area, where present). Each is an independently selectable/deletable `<g>`.

## How to fill a blank template
1. Pick the format's blank SVG in `templates/`.
2. Replace each dim `#565b6b` placeholder `<text>` with real copy — font, size, and position are already set.
3. For each `image-*` group: delete the placeholder rect/hatch/ticks/caption and place your `<image>` (or photo frame) at the same x/y/w/h.
4. Delete the `layer-guides` group before exporting (YouTube / Notion).
5. Keep the `logo` group and the `cochlGrad` / `glow` gradients as-is for brand consistency.

## Regenerate
`gen-social-kit.mjs` emits the filled examples; `gen-social-templates.mjs` emits the blank templates. Both are Node, no dependencies. PNG previews render with headless Chrome at 1×:

```bash
node gen-social-templates.mjs
# then screenshot each SVG at its native px size with --headless=new --screenshot
```

The real `cochl.` logotype (gradient symbol + white wordmark) is embedded inline in both generators.
