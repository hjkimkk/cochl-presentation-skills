#!/bin/bash
# Install the cochl-design plugin with auto-update on (new teammates), or migrate from the v1 copy install.
#   curl -fsSL https://raw.githubusercontent.com/hjkimkk/cochl-presentation-skills/main/scripts/migrate-to-plugin.sh | bash
#   bash scripts/migrate-to-plugin.sh            # same, from a clone
#   bash scripts/migrate-to-plugin.sh --dry-run  # show what would change
# 1. removes the `cochl-skills-autoupdate` SessionStart hook from ~/.claude/settings.json
# 2. moves the copied Cochl skills out of ~/.claude/skills (to a backup folder, not deleted)
# 3. adds the `cochl` marketplace with auto-update on, and installs cochl-design@cochl
# Safe to run twice. Restart Claude Code afterwards.
set -euo pipefail

REPO="hjkimkk/cochl-presentation-skills"
MARKETPLACE="cochl"
PLUGIN="cochl-design"
# Every skill folder this repo ever installed by copy (v1 + v2 names).
OLD_SKILLS="cochl-design cochl-presentation design-review design-sync design-system pitch-deck proposal-doc"

DRY=0
for arg in "$@"; do case "$arg" in --dry-run) DRY=1 ;; -h|--help) sed -n '2,9p' "$0"; exit 0 ;; esac; done
run() { if [ "$DRY" -eq 1 ]; then echo "  [dry-run] $*"; else "$@"; fi; }

CONFIG="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SETTINGS="$CONFIG/settings.json"
SKILL_DIR="$CONFIG/skills"
BACKUP="$CONFIG/skills.cochl-v1-backup-$(date +%Y%m%d%H%M%S)"
# The first clone can pass Claude Code's default 120 s limit on a slow connection.
export CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS="${CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS:-300000}"

command -v claude >/dev/null 2>&1 || { echo "✗ 'claude' CLI not found. Install Claude Code first."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "✗ python3 not found (needed to edit ~/.claude/settings.json)."; exit 1; }

# settings MODE: "hook" removes the old hook; "autoupdate" also turns on marketplace auto-update.
settings() {
python3 - "$SETTINGS" "$DRY" "$MARKETPLACE" "$REPO" "$1" <<'PY'
import json, os, shutil, sys
path, dry, mkt, repo, mode = sys.argv[1], sys.argv[2] == "1", sys.argv[3], sys.argv[4], sys.argv[5]
data = {}
if os.path.exists(path):
    data = json.load(open(path))
hooks = data.get("hooks", {})
ss = hooks.get("SessionStart", [])
mine = lambda g: isinstance(g, dict) and any("cochl-skills-autoupdate" in h.get("command", "") for h in g.get("hooks", []) if isinstance(h, dict))
kept = [g for g in ss if not mine(g)]
removed = len(ss) - len(kept)
if mode == "hook": print(f"  {'would remove' if dry else 'removed'} {removed} hook(s)" if removed else "  none found")
if kept: hooks["SessionStart"] = kept
else: hooks.pop("SessionStart", None)
if not hooks: data.pop("hooks", None)
if mode == "autoupdate":
    # Auto-update is off by default for GitHub marketplaces; turn it on for ours.
    entry = data.setdefault("extraKnownMarketplaces", {}).setdefault(mkt, {"source": {"source": "github", "repo": repo}})
    entry["autoUpdate"] = True
    print(f"  {'would set' if dry else 'set'} extraKnownMarketplaces.{mkt}.autoUpdate = true")
elif not removed:
    sys.exit(0)
if not dry:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path): shutil.copy(path, path + ".bak")
    json.dump(data, open(path, "w"), indent=2)
PY
}

echo "1/3  Old auto-update hook"
settings hook

echo "2/3  Copied skills in $SKILL_DIR"
moved=0
for n in $OLD_SKILLS; do
  d="$SKILL_DIR/$n"
  [ -f "$d/SKILL.md" ] || continue
  # Only move a copy whose SKILL.md name matches ours (never someone else's skill).
  nm="$(grep -m1 '^name:' "$d/SKILL.md" | sed 's/name: *//' || true)"
  case " $OLD_SKILLS pitch-deck-skill proposal-doc-template " in *" $nm "*) ;; *) echo "  skip $n (name: $nm, not a Cochl copy)"; continue ;; esac
  run mkdir -p "$BACKUP"; run mv "$d" "$BACKUP/$n"; moved=$((moved+1))
  echo "  moved $n"
done
[ "$moved" -gt 0 ] && echo "  backup: $BACKUP (delete it once the plugin works)" || echo "  none found"

echo "3/3  Plugin"
run claude plugin marketplace add "$REPO" || run claude plugin marketplace update "$MARKETPLACE"
run claude plugin install "$PLUGIN@$MARKETPLACE" --scope user
settings autoupdate

echo ""
echo "Done. Restart Claude Code, then type /cochl-design."
echo "Private repo: background updates need git credentials that answer silently"
echo "(e.g. 'gh auth login' then 'gh auth setup-git'). Check with: /plugin → Installed."
