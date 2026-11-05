#!/usr/bin/env python3
"""
audit_direction_deck.py — compliance audit for a generated Direction Alignment
& Feedback review deck (design-review skill, type=direction).

Checks the deck against SKILL.md:
  - "Template Flow Rules" → DIRECTION ALIGNMENT & FEEDBACK REVIEW: the 25-item
    order, with items 2, 11, 20 and 21 optional and the allowed variants for
    items 3, 17, 22 and 25
  - no Next Steps slide in a Direction deck
  - Design Process timeline: no off-brand saturated blues (§11)
  - Google Fonts <link> from themes/plex.md present
  - no literal hex / rgb() / rgba() colour in CSS (<style> blocks and style=""
    attributes) outside the :root block
  - nav script keeps its "Do not add theme-switching logic here" comment and
    there is no dead .dark-context rule

Usage:
    python3 audit_direction_deck.py DECK.html [DECK.html ...]

Exit code: 0 when every deck passes, 1 when any check fails, 2 on usage error.
"""
import argparse
import html as htmllib
import os
import re
import sys

# --- Required Direction flow (SKILL.md "Template Flow Rules") ---------------
# (item, label, optional, accepted normalized headings or a predicate name)
# Headings are compared after stripping tags, turning <br> into a space,
# unescaping entities, upper-casing and collapsing whitespace.

def _slash(s):
    return re.sub(r"\s*/\s*", "/", s)


FLOW = [
    (1,  "Cover — Main",                  False, {"DESIGN REVIEW"}),
    (2,  "Cover — Project",               True,  "cover_project"),
    (3,  "Agenda",                        False, {"AGENDA", "TODAY'S AGENDA:"}),
    (4,  "Section divider — OVERVIEW",    False, {"OVERVIEW"}),
    (5,  "Three Things To Know",          False, {"THREE THINGS TO KNOW"}),
    (6,  "Project Goals",                 False, {"PROJECT GOALS"}),
    (7,  "Section divider — DISCOVERY",   False, {"DISCOVERY"}),
    (8,  "Market Research",               False, {"MARKET RESEARCH"}),
    (9,  "User Insights",                 False, {"USER INSIGHTS"}),
    (10, "User Personas",                 False, {"USER PERSONAS"}),
    (11, "Full-bleed Quote",              True,  "quote"),
    (12, "Section divider — STRATEGY & PROCESS", False, {"STRATEGY & PROCESS"}),
    (13, "Design Process",                False, {"DESIGN PROCESS"}),
    (14, "Feedback Needed — Categories",  False, "feedback_categories"),
    (15, "Feedback Needed — Questions",   False, "feedback_questions"),
    (16, "Proposed Concept",              False, {"PROPOSED CONCEPT"}),
    (17, "Section divider — KEY DELIVERABLES (or DIRECTION 01)", False,
         {"KEY DELIVERABLES", "DIRECTION 01"}),
    (18, "Direction Content — Direction 1", False, {"DIRECTION 1"}),
    (19, "Direction Content — Direction 2", False, {"DIRECTION 2"}),
    (20, "Direction Content — Direction 3", True,  {"DIRECTION 3"}),
    (21, "Before/After Workflow",         True,  {"BEFORE/AFTER WORKFLOW"}),
    (22, "Decision Tool (strategic directions / decision matrix / benefit table)",
         False, {"STRATEGIC DIRECTIONS", "DECISION MATRIX", "BENEFIT COMPARISON TABLE"}),
    (23, "Findings & Recommendations",    False, {"FINDINGS & RECOMMENDATIONS"}),
    (24, "Final Mockup",                  False, {"FINAL MOCKUP"}),
    (25, "Closing / Thank You",           False, {"THANKS", "THANK YOU", "QUESTIONS OR NEW IDEAS?"}),
]
REQUIRED = sum(1 for f in FLOW if not f[2])
KNOWN_HEADINGS = set().union(*(f[3] for f in FLOW if isinstance(f[3], set)))
FEEDBACK_CATEGORIES = ("CRAFT", "STRUCTURE", "EXPLORE", "IMPLEMENT")

SLIDE_RE = re.compile(r'<(?:div|section)\b[^>]*\bclass="slide(?:\s[^"]*)?"', re.I)
HEADING_RE = re.compile(r"<h[12]\b[^>]*>(.*?)</h[12]>", re.I | re.S)


def norm(fragment):
    t = re.sub(r"<br\s*/?>", " ", fragment, flags=re.I)
    t = re.sub(r"<[^>]+>", "", t)
    t = htmllib.unescape(t).upper()
    return _slash(re.sub(r"\s+", " ", t).strip())


def split_slides(h):
    starts = [m.start() for m in SLIDE_RE.finditer(h)]
    return [h[s:e] for s, e in zip(starts, starts[1:] + [len(h)])]


def slide_info(s):
    heads = [norm(x) for x in HEADING_RE.findall(s)]
    return {"html": s, "heads": heads, "first": heads[0] if heads else "",
            "text": norm(s)}


def matches(rule, info):
    if isinstance(rule, set):
        return info["first"] in rule
    if rule == "cover_project":
        return "COCHL ·" in info["text"] and info["first"] not in KNOWN_HEADINGS
    if rule == "quote":
        return not info["heads"] and ("--font-quote" in info["html"] or "'Lora'" in info["html"])
    if rule == "feedback_categories":
        return info["first"] == "FEEDBACK NEEDED" and all(c in info["text"] for c in FEEDBACK_CATEGORIES)
    if rule == "feedback_questions":
        return info["first"] == "FEEDBACK NEEDED" and not all(c in info["text"] for c in FEEDBACK_CATEGORIES)
    raise ValueError(rule)


def match_flow(slides):
    """Walk the flow in order. Returns (matched [(item, slide#)], missing, extra)."""
    matched, missing, i = [], [], 0
    for item, label, optional, rule in FLOW:
        if i < len(slides) and matches(rule, slides[i]):
            matched.append((item, i + 1))
            i += 1
        elif not optional:
            missing.append(f"{item} {label}")
    extra = [f"slide {n} ({slides[n - 1]['first'] or 'no heading'})"
             for n in range(i + 1, len(slides) + 1)]
    return matched, missing, extra


def strip_root(h):
    return re.sub(r":root\s*\{[^}]*\}", "", h)


LITERAL_COLOR_RE = re.compile(
    r"rgba?\(\s*\d"                                   # rgb()/rgba() with numbers
    r"|(?:[:(,]\s*|\s)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?=[\s;,)\"'!]|$)",
    re.M)


def audit(path):
    """Return (passes, fails) lists of human-readable check results."""
    with open(path, encoding="utf-8") as fh:
        h = fh.read()
    h_nodata = re.sub(r"data:[^\"')\s]+", "data:", h)  # drop base64 payloads
    passes, fails = [], []

    def check(ok, msg):
        (passes if ok else fails).append(msg)

    slides = [slide_info(s) for s in split_slides(h_nodata)]
    n = len(slides)
    check(REQUIRED <= n <= len(FLOW),
          f"slide count = {n} (expect {REQUIRED}–{len(FLOW)}: {REQUIRED} required + up to "
          f"{len(FLOW) - REQUIRED} optional)")

    matched, missing, extra = match_flow(slides)
    check(not missing, f"all {REQUIRED} required slides present, in order"
          if not missing else "MISSING or OUT OF ORDER: " + "; ".join(missing))
    check(not extra, "no off-flow slides" if not extra
          else "OFF-FLOW slides after the last matched item: " + "; ".join(extra))

    items = [m[0] for m in matched]
    end_ok = items[-4:] == [22, 23, 24, 25]
    check(end_ok, "ending 22 -> 23 -> 24 -> 25 correct" if end_ok else "ENDING WRONG (must be 22 -> 23 -> 24 -> 25)")

    ns = [i + 1 for i, s in enumerate(slides) if any("NEXT STEPS" in x for x in s["heads"])]
    check(not ns, "no NEXT STEPS slide" if not ns else f"NEXT STEPS slide(s) found: {ns}")

    bad = len(re.findall(r"#000CC8|#00088D", h_nodata, re.I))
    check(bad == 0, f"no off-brand timeline blue (found {bad})")

    fok = all(f in h_nodata for f in ("IBM+Plex+Sans", "IBM+Plex+Mono", "Lora", "Public+Sans", "Roboto"))
    check(fok, "theme Google Fonts link present" if fok else "FONT IMPORT MISSING")

    css = "\n".join(re.findall(r"<style\b[^>]*>(.*?)</style>", h_nodata, re.I | re.S)
                    + re.findall(r'\bstyle="([^"]*)"', h_nodata, re.I))
    lit = [m.group(0).strip() for m in LITERAL_COLOR_RE.finditer(strip_root(css))]
    check(not lit, "no literal colour outside :root" if not lit
          else f"{len(lit)} literal colour(s) outside :root, e.g. {lit[:3]}")

    dead = len(re.findall(r"\.dark-context\s*\{", h_nodata))
    check(dead == 0, f"no dead .dark-context rule (found {dead})")
    check("Do not add theme-switching logic here" in h_nodata, "nav intent comment present")

    return passes, fails


def main(argv=None):
    ap = argparse.ArgumentParser(description="Audit a design-review Direction deck against SKILL.md.")
    ap.add_argument("decks", nargs="+", metavar="DECK.html", help="generated deck(s) to audit")
    args = ap.parse_args(argv)
    print("=" * 70)
    print("Direction deck compliance audit")
    print("=" * 70)
    total_fail = 0
    for path in args.decks:
        name = os.path.basename(path)
        if not os.path.isfile(path):
            print(f"\n  {name}: FILE NOT FOUND ({path})")
            total_fail += 1
            continue
        passes, fails = audit(path)
        print(f"\n  {name}  ({len(passes)} pass / {len(fails)} fail)")
        for p in passes:
            print(f"     [PASS] {p}")
        for f in fails:
            print(f"     [FAIL] {f}")
        total_fail += len(fails)
    print("\n" + "=" * 70)
    print("RESULT:", "ALL PASS" if total_fail == 0 else f"{total_fail} FAILURE(S)")
    return 0 if total_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
