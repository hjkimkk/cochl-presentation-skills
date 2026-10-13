# Phase 2: plugin namespacing check

Status: **answered from the docs (2026-10-13); partly confirmed live on HJ's machine after migration (2026-10-13).**

Live: `claude plugin list` shows `cochl-design@cochl` 2.0.0 (user scope, enabled, marketplace auto-update on). The session skill list shows all seven as `cochl-design:<name>` (`cochl-design:cochl-design`, `cochl-design:cochl-presentation`, `cochl-design:pitch-deck`, `cochl-design:design-review`, `cochl-design:proposal-doc`, `cochl-design:design-system`, `cochl-design:design-sync`); the v1 copies are gone from `~/.claude/skills/`. Still to confirm by typing: does bare `/cochl-design` and `/cochl-presentation` run the plugin skill? The automated probe could not run (see "Probe attempt").

Docs answer (code.claude.com/docs/en/skills.md, plugins/*): plugin skills are namespaced `/<plugin>:<skill>`, and a bare `/<skill>` "also invokes the skill unless another command already uses that name". So once `scripts/migrate-to-plugin.sh` has moved the v1 copies out of `~/.claude/skills/`, bare `/cochl-design`, `/cochl-presentation` etc. resolve to the plugin. The router is reachable as `/cochl-design` and `/cochl-design:cochl-design`; no move to a root skill needed unless the live check shows otherwise.

## Question

When `skills/` is packaged as a Claude Code plugin named `cochl-design`, do the bare commands still resolve, and what names does the skill list show?

## Throwaway plugin (built)

`${TMPDIR:-/tmp}/cochl-design-plugin` contains `.claude-plugin/plugin.json` (`name: cochl-design`, version `0.0.0-check`) and a copy of `skills/` (7 skills: cochl-design, cochl-presentation, design-review, design-sync, design-system, pitch-deck, proposal-doc). In the agent sandbox the directory was `/tmp/claude-501`. Rebuild with (works from a fresh shell):

```bash
cd /Users/hyo/cochl-presentation-skills
P="${TMPDIR:-/tmp}/cochl-design-plugin"; rm -rf "$P"; mkdir -p "$P/.claude-plugin"
cp -R skills "$P/skills"
echo '{ "name": "cochl-design", "version": "0.0.0-check", "description": "namespacing check" }' > "$P/.claude-plugin/plugin.json"
# marker on the plugin copies only (repo skills/ and ~/.claude are untouched)
for n in cochl-presentation design-review design-system pitch-deck proposal-doc; do
  perl -pi -e 'if(!$d){ if(/^description:\s*[>|][-+]?\s*$/){$w=1} elsif($w && /^(\s+)\S/){ s/^(\s+)/$1\[plugin-copy\] /; $d=1 } elsif(s/^(description:[ \t]*)(?![>|])/$1\[plugin-copy\] /){ $d=1 } }' "$P/skills/$n/SKILL.md"
done
grep -H '^description:' "$P"/skills/*/SKILL.md | cut -c1-140   # check marker present on the 5
```

The perl one-liner handles both single-line and block (`>` / `|`) descriptions; the grep output for block ones shows only the indicator line, so also run `grep -A1 '^description:' "$P/skills/design-review/SKILL.md"` to see the marker.

## Probe attempt

Command: `claude -p --plugin-dir "$TMPDIR/cochl-design-plugin" --max-turns 1 "<list skills containing cochl, pitch, ...>"`

Result: `Not logged in · Please run /login`. The sandbox also denied outbound network to api.anthropic.com. No skill list was obtained. `claude --help` only says `--plugin-dir <path>` loads a plugin from a directory or .zip, and `--bare` "Skills still resolve via /skill-name"; it gives no namespacing rule.

Caveat for the manual run: `~/.claude/skills` already holds copies named cochl-presentation, design-review, design-system, pitch-deck and proposal-doc. A bare name may resolve to those copies, not the plugin. The `/` autocomplete may show both bare and prefixed entries. The evidence is the `cochl-design:` prefix or the `[plugin-copy]` marker in the description; a bare entry without the marker is the user's copy.

## Results

| Command | `/cochl-design:<name>` resolves? | Bare `/<name>` runs/lists which copy (marker = plugin, no marker = user)? | Listed as |
|---|---|---|---|
| /cochl-design | PENDING (HJ) | PENDING (HJ) (only exists in plugin) | PENDING (HJ) |
| /cochl-presentation | PENDING (HJ) | PENDING (HJ) | PENDING (HJ) |
| /pitch-deck | PENDING (HJ) | PENDING (HJ) | PENDING (HJ) |
| /design-review | PENDING (HJ) | PENDING (HJ) | PENDING (HJ) |
| /proposal-doc | PENDING (HJ) | PENDING (HJ) | PENDING (HJ) |
| /design-system | PENDING (HJ) | PENDING (HJ) | PENDING (HJ) |
| /design-sync | PENDING (HJ) | PENDING (HJ) (only exists in plugin) | PENDING (HJ) |

## Manual procedure (HJ, normal terminal)

1. Rebuild the plugin with the snippet above (includes the `[plugin-copy]` marker).
2. `mkdir -p ~/scratch-ns && cd ~/scratch-ns && claude --plugin-dir "${TMPDIR:-/tmp}/cochl-design-plugin"`
3. Type `/` and read the list. For each of the 7 names record: (a) does `/cochl-design:<name>` appear and run; (b) does bare `/<name>` appear, and does its description carry `[plugin-copy]` (plugin copy) or not (user copy). Run each bare command once and confirm which copy responds (the marker shows in the list description).
4. `/cochl-design` and `/design-sync` exist only in the plugin, so a bare hit is unambiguous.
5. Optional second pass with the user copies hidden (reversible; restart claude after each move):

```bash
for n in cochl-presentation design-review design-system pitch-deck proposal-doc; do mv ~/.claude/skills/$n ~/.claude/skills/$n.off; done
# ... run the test again in a new claude session ...
for n in cochl-presentation design-review design-system pitch-deck proposal-doc; do mv ~/.claude/skills/$n.off ~/.claude/skills/$n; done   # RESTORE
```

6. Fill the table above.

## Workstream B action

If `/cochl-design` only appears as `cochl-design:cochl-design`, then: move the router to the plugin root skill (so the command is the bare plugin name).
Else: no action.
Current action: PENDING (HJ). Apply the rule above only once the table is filled.
