#!/usr/bin/env bash
# Packs packages/ui as a release would and installs the tarball into a scratch Vite app outside this workspace, then
# typechecks and builds it. That's the only place the package is read from node_modules as apps read it, which
# behaves differently from the workspace symlink (Node won't strip TypeScript under node_modules, for one).
# usage: scripts/check-package.sh [tarball]   (packs one itself when none is given)
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

if [ $# -ge 1 ]; then
  tarball="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
else
  (cd "$root/packages/ui" && npm pack --silent --pack-destination "$work" >/dev/null)
  tarball="$(ls "$work"/pluscosmic-ui-*.tgz)"
fi

app="$work/app"
mkdir -p "$app/src"
cd "$app"
cat > package.json <<JSON
{
  "name": "package-check",
  "private": true,
  "type": "module",
  "dependencies": {
    "@pluscosmic/ui": "file:$tarball",
    "react": "^19.3.0",
    "react-dom": "^19.3.0"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "typescript": "^6.0.3",
    "vite": "^8.3.0"
  }
}
JSON
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "allowImportingTsExtensions": true,
    "types": ["vite/client"]
  },
  "include": ["src", "vite.config.ts"]
}
JSON
cat > vite.config.ts <<'TS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { appearance } from "@pluscosmic/ui/vite";

export default defineConfig({ plugins: [react(), appearance({ storageKey: "check" })] });
TS
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>check</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
HTML
cat > src/main.tsx <<'TSX'
import { createRoot } from "react-dom/client";
import { AppearanceProvider, AppearanceSettings, Button, Notice, ToastProvider } from "@pluscosmic/ui";
import "@pluscosmic/ui/fonts.css";
import "@pluscosmic/ui/styles.css";

createRoot(document.getElementById("app")!).render(
  <AppearanceProvider storageKey="check">
    <ToastProvider>
      <Button variant="primary">Save</Button>
      <Notice tone="info" title="Hello" />
      <AppearanceSettings />
    </ToastProvider>
  </AppearanceProvider>,
);
TSX

npm install --silent --no-audit --no-fund
npx tsc -p .
npx vite build --logLevel warn
grep -q '"check-theme-preference"' dist/index.html || { echo "the first-paint script isn't in index.html"; exit 1; }
echo "package check passed: $(basename "$tarball") installs, typechecks and builds"
