import { defineConfig } from "vite";

// GitHub Pages serves project sites from a /<repo-name>/ subpath, so every
// asset URL Vite emits needs that prefix — without it the built page 404s
// on all its JS/CSS/images once deployed.
export default defineConfig({
  base: "/Bookshelf-Portfolio/",
});
