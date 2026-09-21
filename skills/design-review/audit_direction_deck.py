#!/usr/bin/env python3
"""
audit_direction_deck.py — automated compliance audit for generated
Direction Alignment review decks (design-review skill, type=direction).

Checks each deck against the required 25-slide Direction flow defined in
SKILL.md "Template Flow Rules", plus brand and hygiene rules that have caused
regressions before (off-spec NEXT STEPS pair, off-brand timeline blues, dead
`.dark-context` nav logic, fabricated copy).

Usage:
    python3 audit_direction_deck.py [deck.html ...]

With no arguments it audits the two reference case decks under "Claude outputs/".
Exit code is 0 only when every deck passes every check (CI-friendly).
"""
import re
import sys
import os

# Required Direction flow: (item#, label, ordered signature substring in HTML).
# Signatures are the same markers the design-review generator emits per archetype.
FLOW = [
    (1,  "Cover — Main",            "DESIGN REVIEW"),
    (2,  "Cover — Project",         "Cochl · "),
    (3,  "Agenda",                  ">AGENDA<"),
    (4,  "Divider OVERVIEW",        ">OVERVIEW</h2>"),
    (5,  "Three Things To Know",    "THREE THINGS TO KNOW"),
    (6,  "Project Goals",           "PROJECT GOALS"),
    (7,  "Divider DISCOVERY",       ">DISCOVERY</h2>"),
    (8,  "Market Research",         "MARKET RESEARCH"),
    (9,  "User Insights",           "USER INSIGHTS"),
    (10, "User Personas",           "USER PERSONAS"),
    (11, "Full-bleed Quote",        "'Lora'"),
    (12, "Divider STRATEGY",        "STRATEGY &amp; PROCESS</h2>"),
    (13, "Design Process",          "DESIGN PROCESS"),
    (14, "Feedback — Categories",   ">FEEDBACK NEEDED</h2>"),
    (15, "Feedback — Questions",    "FEEDBACK<br>NEEDED"),
    (16, "Proposed Concept",        "PROPOSED CONCEPT"),
    (17, "Divider KEY DELIVERABLES","KEY DELIVERABLES</h2>"),
    (18, "Direction 1",             "DIRECTION 1"),
    (19, "Direction 2",             "DIRECTION 2"),
    (20, "Direction 3",             "DIRECTION 3"),
    (21, "Before/After Workflow",   "BEFORE / AFTER WORKFLOW"),
    (22, "Decision Tool",           "STRATEGIC DIRECTIONS"),
    (23, "Findings & Recs",         "FINDINGS &amp; RECOMMENDATIONS"),
    (24, "Final Mockup",            "FINAL MOCKUP"),
    (25, "Closing / Thanks",        ">THANKS</h2>"),
]

DEFAULT_DECKS = [
    "Claude outputs/design-review-audio-event-api-case1/case1_audio_event_api.html",
    "Claude outputs/design-review-sound-studio-case2/case2_sound_studio.html",
]


def audit(path):
    """Return (passes, fails) lists of human-readable check results."""
    with open(path, encoding="utf-8") as fh:
        h = fh.read()
    passes, fails = [], []

    def check(ok, msg):
        (passes if ok else fails).append(msg)

    # 1) slide count == 25
    sc = len(re.findall(r'class="slide"', h))
    check(sc == 25, f"slide count = {sc} (expect 25)")

    # 2) all required archetypes present, 3) in required order
    last, order_ok, missing = -1, True, []
    for item, label, sig in FLOW:
        idx = h.find(sig)
        if idx == -1:
            missing.append(f"{item} {label}")
        else:
            if idx < last:
                order_ok = False
            last = idx
    check(not missing, "all 25 required archetypes present"
          if not missing else f"MISSING: {', '.join(missing)}")
    check(order_ok, "archetypes in required order" if order_ok else "ORDER VIOLATION")

    # 4) prohibited: no NEXT STEPS slide in a Direction deck
    ns = len(re.findall(r'next steps', h, re.I))
    check(ns == 0, f"no NEXT STEPS slide (found {ns})")

    # 5) fixed ending 22 -> 23 -> 24 -> 25
    ends = [h.find("STRATEGIC DIRECTIONS"), h.find("FINDINGS &amp; RECOMMENDATIONS"),
            h.find("FINAL MOCKUP"), h.find(">THANKS</h2>")]
    end_ok = all(e != -1 for e in ends) and ends == sorted(ends)
    check(end_ok, "ending 22->23->24->25 correct" if end_ok else "ENDING ORDER WRONG")

    # 6) brand: no off-brand timeline blues (SKILL.md §11 warning)
    bad = len(re.findall(r'#000CC8|#00088D', h, re.I))
    check(bad == 0, f"no off-brand timeline blue (found {bad})")

    # 7) all five font families imported
    fok = all(f in h for f in ("IBM+Plex+Sans", "IBM+Plex+Mono", "Lora", "Public+Sans", "Roboto"))
    check(fok, "all 5 font families imported" if fok else "FONT IMPORT MISSING")

    # 8) hygiene: no dead .dark-context CSS rule + intent comment present (rev6)
    dead = len(re.findall(r'\.dark-context\s*\{', h))
    check(dead == 0, f"no dead .dark-context rule (found {dead})")
    check("Do not add theme-switching logic here" in h,
          "nav intent comment present")

    return passes, fails


def main(argv):
    decks = argv[1:] or DEFAULT_DECKS
    print("=" * 70)
    print("Direction deck compliance audit")
    print("=" * 70)
    total_fail = 0
    for path in decks:
        name = os.path.basename(path)
        if not os.path.exists(path):
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
    print("RESULT:", "ALL PASS - NO REGRESSIONS" if total_fail == 0
          else f"{total_fail} FAILURE(S)")
    return 0 if total_fail == 0 else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
