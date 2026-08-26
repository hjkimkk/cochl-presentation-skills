#!/bin/bash
# Cochl Claude Skills Installer
# Run from the project root:  bash .claude/install-skills.sh
#
# Discovery model: Claude Code loads each skill from a directory under
# ~/.claude/skills/ that contains a SKILL.md (its `name:` is the slash command).
# This installer copies every skill directory under ./skills/ accordingly.
set -euo pipefail
shopt -s nullglob

SKILL_DIR="$HOME/.claude/skills"
# install-skills.sh lives in .claude/, so the skills/ dir is one level up (repo root).
SRC="$(cd "$(dirname "$0")/.." && pwd)/skills"
mkdir -p "$SKILL_DIR"

echo "Installing Cochl Claude skills to $SKILL_DIR ..."

# Flat single-file skills, if any live directly under ./skills/ (none by default).
for f in "$SRC"/*.md; do
  cp "$f" "$SKILL_DIR/$(basename "$f")"
  echo "  ✓ $(basename "$f")"
done

# Directory skills — clean-replace each so updates don't leave stale files.
for d in "$SRC"/*/; do
  name="$(basename "$d")"
  rm -rf "$SKILL_DIR/$name"
  cp -R "$d" "$SKILL_DIR/$name"
  if [ -f "$d/SKILL.md" ]; then
    nm="$(grep -m1 '^name:' "$d/SKILL.md" | sed 's/name: *//' || true)"
    echo "  ✓ $name/  (skill: ${nm:-unknown})"
  else
    echo "  ✓ $name/  (support files — no SKILL.md)"
  fi
done

echo ""
echo "Done! Restart Claude Code, then try:"
echo "  /cochl-presentation   — build any Cochl deck, brochure, or social/press banner"
echo "  /pitch-deck-skill     — update/rebuild within the Cochl PT template"
echo "  /frontend-design      — apply the Cochl design system"
echo "  /install-cochl-design-system"
