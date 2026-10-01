#!/usr/bin/env python3
"""Compare two brand-facts JSON files. Exit 1 on any brand-fact difference."""
import json, sys
from pathlib import Path

def compare(a, b):
    fails, notes = [], []
    for key in ("fonts", "colors"):
        added, removed = set(b[key]) - set(a[key]), set(a[key]) - set(b[key])
        if added: fails.append(f"{key} added: {', '.join(sorted(added))}")
        if removed: fails.append(f"{key} removed: {', '.join(sorted(removed))}")
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
    a, b = (json.loads(Path(p).read_text()) for p in argv[:2])
    fails, notes = compare(a, b)
    md = "\n".join(["## Brand facts", *([f"- ✗ {f}" for f in fails] or ["- ✓ no brand-fact differences"]),
                    "## Layout notes", *([f"- {n}" for n in notes] or ["- none"])])
    print(md)
    if "--html" in argv:
        g = lambda flag: Path(argv[argv.index(flag) + 1])
        html_report(g("--html"), g("--before-shots"), g("--after-shots"), md)
    return 1 if fails else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
