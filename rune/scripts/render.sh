#!/usr/bin/env bash
# Renders every gallery scene headless into a folder (default rune/renders), at 2x.
# usage: rune/scripts/render.sh [out-dir]
set -euo pipefail
cd "$(dirname "$0")/.."
out="${1:-renders}"
mkdir -p "$out"
cargo build -q -p foundation-gallery
for scheme in stacks oxblood ink walnut graphite; do
  for mode in light dark; do
    ./target/debug/foundation-gallery --snap "$out/$scheme-$mode.png" --scene "$scheme-$mode" --scale 2 >/dev/null
  done
done
./target/debug/foundation-gallery --snap "$out/dialog.png" --scene dialog --scale 2 >/dev/null
echo "rendered $(ls "$out"/*.png | wc -l) scenes into $out"
