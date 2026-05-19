#!/bin/bash
# Cochl Claude Skills Installer
# Run from the project root: bash .claude/install-skills.sh

SKILL_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/skills"

mkdir -p "$SKILL_DIR"

echo "Installing Cochl Claude skills to $SKILL_DIR..."

for f in "$SCRIPT_DIR"/*.md; do
  name=$(basename "$f")
  cp "$f" "$SKILL_DIR/$name"
  echo "  ✓ $name"
done

for d in "$SCRIPT_DIR"/*/; do
  name=$(basename "$d")
  cp -r "$d" "$SKILL_DIR/$name"
  echo "  ✓ $name/ (directory)"
done

echo ""
echo "Done! Restart Claude Code, then try:"
echo "  /cochl-pitch-deck"
echo "  /pitch-deck-skill"
echo "  /frontend-design"
echo "  /install-cochl-ds"
