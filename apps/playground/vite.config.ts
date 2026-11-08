import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { appearance } from "@pluscosmic/ui/vite";

// The storage key must match AppearanceProvider's in main.tsx.
export default defineConfig({
  plugins: [react(), appearance({ storageKey: "playground" })],
});
