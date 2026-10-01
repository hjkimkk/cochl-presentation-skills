# Phase 2: plugin namespacing check

Status: PENDING (HJ). The automated probe could not run (see "Probe attempt").

## Question

When `skills/` is packaged as a Claude Code plugin named `cochl-design`, do the bare commands still resolve, and what names does the skill list show?

## Throwaway plugin (built)

`$TMPDIR/cochl-design-plugin` contains `.claude-plugin/plugin.json` (`name: cochl-design`, version `0.0.0-check`) and a copy of `skills/` (7 skills: cochl-design, cochl-presentation, design-review, design-sync, design-system, pitch-deck, proposal-doc). In this sandbox `$TMPDIR` is `/tmp/claude-501`. Rebuild with:

```bash
P="$TMPDIR/cochl-design-plugin"; rm -rf "$P"; mkdir -p "$P/.claude-plugin"
cp -R skills "$P/skills"
echo '{ "name": "cochl-design", "version": "0.0.0-check", "description": "namespacing check" }' > "$P/.claude-plugin/plugin.json"
```

## Probe attempt

Command: `claude -p --plugin-dir "$TMPDIR/cochl-design-plugin" --max-turns 1 "<list skills containing cochl, pitch, ...>"`

Result: `Not logged in · Please run /login`. The sandbox also denied outbound network to api.anthropic.com. No skill list was obtained. `claude --help` only says `--plugin-dir <path>` loads a plugin from a directory or .zip, and `--bare` "Skills still resolve via /skill-name"; it gives no namespacing rule.

Caveat for the manual run: `~/.claude/skills` already holds copies named cochl-presentation, design-review, design-system, pitch-deck and proposal-doc. A bare name may resolve to those copies, not the plugin. Only entries shown with a `cochl-design:` prefix prove plugin behaviour.

## Results

| Command | Resolves bare? | Listed as |
|---|---|---|
| /cochl-design | PENDING (HJ) | PENDING (HJ) |
| /cochl-presentation | PENDING (HJ) | PENDING (HJ) |
| /pitch-deck | PENDING (HJ) | PENDING (HJ) |
| /design-review | PENDING (HJ) | PENDING (HJ) |
| /proposal-doc | PENDING (HJ) | PENDING (HJ) |
| /design-system | PENDING (HJ) | PENDING (HJ) |
| /design-sync | PENDING (HJ) | PENDING (HJ) |

## Manual procedure (HJ, normal terminal)

1. Build the plugin with the commands above (any scratch folder works for `$TMPDIR`).
2. `mkdir -p ~/scratch-ns && cd ~/scratch-ns && claude --plugin-dir "$TMPDIR/cochl-design-plugin"`
3. Type `/` and look at the list. For each of the 7 commands record: (a) does typing the bare `/name` offer and run it, (b) is there also a `cochl-design:name` entry. Entries with the `cochl-design:` prefix are the plugin copies.
4. For the 5 names that also exist in `~/.claude/skills`, bare resolution is ambiguous. Disambiguate by invoking `/cochl-design:<name>` explicitly. Optionally rename the five user copies for the test, then restore them. This was deliberately not done automatically.
5. `/cochl-design` and `/design-sync` exist only in the plugin, so their bare result is unambiguous.
6. Fill the table above.

## Workstream B action

If `/cochl-design` only appears as `cochl-design:cochl-design`, then: move the router to the plugin root skill (so the command is the bare plugin name).
Current action: PENDING (HJ). Apply the line above only once the table is filled.
