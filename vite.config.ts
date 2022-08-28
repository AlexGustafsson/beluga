import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: "frontend",
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: ["es2021", "chrome97", "safari13"],
    minify: false,
    sourcemap: true,
    outDir: "../internal/web/static",
    emptyOutDir: true,
  },
});
