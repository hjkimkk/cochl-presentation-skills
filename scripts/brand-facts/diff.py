#!/usr/bin/env python3
"""Compare two brand-facts JSON files. Exit 1 on any brand-fact difference."""
import json, re, sys
from pathlib import Path

GENERIC_FONTS = {"serif", "sans-serif", "monospace", "system-ui", "cursive", "fantasy"}

def _hex(h):
    h = h.lower().lstrip("#")
    return "#" + ("".join(c * 2 for c in h) if len(h) == 3 else h)

def parse_theme(paths):
    """Return (THEME_COLORS, THEME_FONTS) collected from theme .md/.css files."""
    colors, fonts = set(), set()
    for p in paths:
        for line in Path(p).read_text().splitlines():
            # custom-property declarations, possibly several per line (e.g. `:root { --a: #fff; }`)
            for m in re.finditer(r"--([\w-]+)\s*:\s*([^;}]*)", line):
                name, val = m.group(1), m.group(2)
                if re.fullmatch(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})", val.strip()):
                    colors.add(_hex(val.strip()))
                elif name.startswith("font-"):
                    for fam in val.split(","):
                        fam = fam.strip().strip("'\"").strip()
                        if fam and fam.lower() not in GENERIC_FONTS:
                            fonts.add(fam)
    return colors, fonts

def compare(a, b, theme=None):
    fails, notes = [], []
    if theme is None:
        for key in ("fonts", "colors"):
            added, removed = set(b[key]) - set(a[key]), set(a[key]) - set(b[key])
            if added: fails.append(f"{key} added: {', '.join(sorted(added))}")
            if removed: fails.append(f"{key} removed: {', '.join(sorted(removed))}")
    else:
        t_colors, t_fonts = theme
        for key, allowed, label in (("fonts", t_fonts, "font"), ("colors", t_colors, "color")):
            before, after = set(a[key]), set(b[key])
            for x in sorted(after - before - allowed):
                fails.append(f"{label} {x} is off-theme (not in before or theme)")
            for x in sorted((before & allowed) - after):
                fails.append(f"{label} {x} is a theme {label} missing after (in before and theme, absent in after)")
            gone = sorted(before - after - allowed)
            if gone: notes.append(f"{key} dropped (non-theme): {', '.join(gone)}")
    if a["canvas"] != b["canvas"]:
        fails.append(f"canvas {a['canvas']} → {b['canvas']}")
    for i, logo in enumerate(b["logos"]):
        if logo["distortion"] > 0.05:
            fails.append(f"logo #{i + 1} distorted {logo['distortion']:.0%} ({logo['src']})")
    if a["layouts"] != b["layouts"]:
        notes.append(f"layouts {a['layouts']} → {b['layouts']}")
    return fails, notes

def html_report(out: Path, before: Path, after: Path, md: str):
    names = sorted({p.name for p in before.glob("*.png")} | {p.name for p in after.glob("*.png")})
    rows = "".join(
        f"<tr><td>{n}</td><td><img src='{(before / n).resolve().as_uri()}'></td>"
        f"<td><img src='{(after / n).resolve().as_uri()}'></td></tr>" for n in names)
    out.write_text(
        "<!doctype html><meta charset=utf-8><title>Phase 2 regression</title>"
        "<style>body{font-family:system-ui;margin:24px}img{width:560px;border:1px solid #ccc}"
        "td{vertical-align:top;padding:6px}</style>"
        f"<pre>{md}</pre><table><tr><th></th><th>before</th><th>after</th></tr>{rows}</table>")

def main(argv):
    allow = [argv[i + 1] for i, x in enumerate(argv) if x == "--allow" and i + 1 < len(argv)]
    a, b = (json.loads(Path(p).read_text()) for p in argv[:2])
    fails, notes = compare(a, b, parse_theme(allow) if allow else None)
    md = "\n".join(["## Brand facts", *([f"- ✗ {f}" for f in fails] or ["- ✓ no brand-fact differences"]),
                    "## Layout notes", *([f"- {n}" for n in notes] or ["- none"])])
    print(md)
    if "--html" in argv:
        g = lambda flag: Path(argv[argv.index(flag) + 1])
        html_report(g("--html"), g("--before-shots"), g("--after-shots"), md)
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
