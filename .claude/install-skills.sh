#!/bin/bash
# Cochl Claude Skills Installer  (run once: bash .claude/install-skills.sh)
# Copies skills to ~/.claude/skills AND installs a user-level SessionStart hook
# so skills self-update from git every session, any project. --skip-hook = copy only.
set -euo pipefail
shopt -s nullglob

SKIP_HOOK=0
for arg in "$@"; do case "$arg" in --skip-hook) SKIP_HOOK=1 ;; esac; done

SKILL_DIR="$HOME/.claude/skills"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/skills"
mkdir -p "$SKILL_DIR"
echo "Installing Cochl Claude skills to $SKILL_DIR ..."

for f in "$SRC"/*.md; do cp "$f" "$SKILL_DIR/$(basename "$f")"; echo "  ✓ $(basename "$f")"; done

for d in "$SRC"/*/; do
  name="$(basename "$d")"; rm -rf "$SKILL_DIR/$name"; cp -R "$d" "$SKILL_DIR/$name"
  if [ -f "$d/SKILL.md" ]; then
    nm="$(grep -m1 '^name:' "$d/SKILL.md" | sed 's/name: *//' || true)"
    echo "  ✓ $name/  (skill: ${nm:-unknown})"
  else echo "  ✓ $name/  (support files)"; fi
done

if [ "$SKIP_HOOK" -eq 0 ] && command -v python3 >/dev/null 2>&1; then
  SETTINGS="$HOME/.claude/settings.json"
  HOOK_CMD=": cochl-skills-autoupdate; git -C \"$REPO_ROOT\" pull --ff-only -q 2>/dev/null || true; bash \"$REPO_ROOT/.claude/install-skills.sh\" --skip-hook >/dev/null 2>&1 || true"
  python3 - "$SETTINGS" "$HOOK_CMD" <<'PY' || echo "  ! settings.json not updated (skills still installed)"
import json, os, sys, shutil
path, cmd = sys.argv[1], sys.argv[2]
os.makedirs(os.path.dirname(path), exist_ok=True)
data = {}
if os.path.exists(path):
    try: data = json.load(open(path)); shutil.copy(path, path+".bak")
    except Exception: shutil.copy(path, path+".corrupt.bak"); data = {}
if not isinstance(data, dict): data = {}
hooks = data.setdefault("hooks", {})
ss = hooks.get("SessionStart");  ss = ss if isinstance(ss, list) else []
def mine(g):
    return isinstance(g, dict) and any(isinstance(h, dict) and "cochl-skills-autoupdate" in h.get("command","") for h in g.get("hooks", []))
ss = [g for g in ss if not mine(g)]
ss.append({"hooks": [{"type": "command", "command": cmd}]})
hooks["SessionStart"] = ss
json.dump(data, open(path, "w"), indent=2)
print("  ✓ auto-update hook installed in ~/.claude/settings.json")
PY
fi

echo ""
echo "Done! Restart Claude Code. Auto-update is ON (skills refresh from git each session)."
echo "Turn it off: remove the 'cochl-skills-autoupdate' hook from ~/.claude/settings.json"
