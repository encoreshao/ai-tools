#!/usr/bin/env bash
# Build the AI Tools for Work site into dist/.
#
# src/ is already a complete static site (index.html, styles.css, js/ modules, logos/),
# so the build is a clean copy: dist/ always matches src/ exactly, with nothing stale left over.
# dist/ is generated output: never edit it by hand.
#
# Usage:
#   ./build.sh                                     build dist/
#   python3 -m http.server 8000 --directory dist   preview at http://localhost:8000

set -euo pipefail
cd "$(dirname "$0")"

SRC=src
OUT=dist

fail() { printf '\033[31mError:\033[0m %s\n' "$1" >&2; exit 1; }
for f in index.html styles.css js/main.js; do
  [ -f "$SRC/$f" ] || fail "$SRC/$f not found."
done

rm -rf "$OUT"
mkdir -p "$OUT"
# Copy everything except macOS metadata files
(cd "$SRC" && find . -type f ! -name '.DS_Store' -print0 | while IFS= read -r -d '' f; do
  mkdir -p "../$OUT/$(dirname "$f")"; cp "$f" "../$OUT/$f"
done)

files=$(find "$OUT" -type f | wc -l | tr -d ' ')
size=$(du -sh "$OUT" | cut -f1)
echo "  $OUT/  $files files, $size"
