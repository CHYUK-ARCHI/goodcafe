import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset URLs relative so the build works under any GitHub Pages
// path (project site /goodcafe/ or a custom domain) without further config.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { target: "es2020", sourcemap: false }
});
