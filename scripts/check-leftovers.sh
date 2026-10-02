#!/bin/bash
# For each file under the given leftover paths, find an identical file elsewhere
# in the repo (outside the leftover paths). Prints DUP/UNIQUE; exit 1 if any UNIQUE.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
leftovers=("$@")
is_leftover() { for l in "${leftovers[@]}"; do [[ "$1" == "$l" || "$1" == "$l/"* ]] && return 0; done; return 1; }

# "hash path" index of every tracked file outside the leftovers (bash 3.2-safe, no assoc arrays).
index="$(mktemp "${TMPDIR:-/tmp}/leftovers.XXXXXX")"; trap 'rm -f "$index"' EXIT
while IFS= read -r f; do
  is_leftover "$f" && continue
  echo "$(shasum -a 256 "$f" | cut -d' ' -f1) $f" >> "$index"
done < <(git ls-files)

unique=0
for l in "${leftovers[@]}"; do
  while IFS= read -r f; do
    h=$(shasum -a 256 "$f" | cut -d' ' -f1)
    match=$(grep -m1 "^$h " "$index" | cut -d' ' -f2- || true)
    if [[ -n "$match" ]]; then echo "DUP    $f = $match"
    else echo "UNIQUE $f"; unique=1; fi
  done < <(git ls-files "$l")
done
exit $unique
