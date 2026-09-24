import { defineConfig } from "vite";

// GitHub Pages serves project sites from a /<repo-name>/ subpath, so every
// asset URL Vite emits needs that prefix — without it the built page 404s
// on all its JS/CSS/images once deployed.
//
// Two pages: index.html (home + lanyard) and library.html (the bookshelf).
// Vite only builds pages listed in `input`. The lanyard is written in JSX,
// so esbuild needs the automatic runtime (no `import React` in each file).
export default defineConfig({
  base: "/Bookshelf-Portfolio/",
  esbuild: { jsx: "automatic" },
  build: {
    rollupOptions: {
      input: { main: "index.html", library: "library.html" },
    },
  },
});
