# Portfolio Bookshelf — Starter

A working prototype: a carousel of wooden shelves, each always at
least 2 rows tall, that fills each row from the left before wrapping
to the next. Click a book to pull it forward, click it again to open
it — pages are real hinged 3D pages that flip open, and you add them
by dropping image files into a folder, not by editing code. Click the
rounded arrows on the floor to rotate the carousel and bring another
bookshelf to the front.

## Running it

```bash
npm install
npm run dev
```

Open the local URL it prints (usually http://localhost:5173).

- Click a book to pull it forward, click it again to open it
- While a book is open: click the right-hand stack to flip forward,
  the left-hand stack to flip back — or use the Prev/Next buttons
- Click the ‹ / › arrows on the floor to rotate to the previous/next
  bookshelf
- Drag to orbit, scroll to zoom

## Adding real pages (no code editing required)

There's more than one physical bookshelf, arranged in a carousel —
each one comes from its own folder under `src/shelves/`, e.g.
`src/shelves/Bookshelf 1/`, `src/shelves/Bookshelf 2/`. Inside each
shelf folder, projects work just like a single-shelf site would:
every folder under that shelf's `pages/` *is* a book, and becomes its
spine label automatically. Each project folder holds two subfolders:

- `src/shelves/<Shelf Name>/pages/<Your Project>/cover/` — drop one
  image in here for the wraparound cover (see the cover dimensions
  note below).
- `src/shelves/<Shelf Name>/pages/<Your Project>/pages/` — drop page
  images in here, named `1.png`, `2.png`, `3.png`... The number
  controls page order. jpg, jpeg, and webp work too.

Add or rename a project folder and its book appears/updates on that
shelf the next time you run `npm run dev` or refresh the page — no
array to edit, no path to type out. Until a project's `pages/` folder
has images in it, the book still opens — it just shows a placeholder
page reminding you where to drop files.

Adding a whole new bookshelf (a new carousel slot) means creating a
new folder directly under `src/shelves/` (with its own `pages/` and
`papers/` subfolders inside) *and* adding its name to
`knownShelfNames` near the top of `src/main.js` — that second step is
only needed because a brand new, still-empty shelf has no image files
yet for the auto-scan to find it by. A shelf that already has real
content in it doesn't need to be listed there; it's picked up
automatically the same way projects are.

### Grouping pages into sticky tabs

Optionally, group `pages/` into numbered subfolders to get clickable
sticky-note tabs down the fore-edge of the open book, one per
subfolder:

```
src/shelves/Bookshelf 2/pages/Your Project/pages/1 Introduction/1.png, 2.png
src/shelves/Bookshelf 2/pages/Your Project/pages/2 Target Audience/1.png, 2.png
```

The leading number controls tab order; the rest of the folder name
becomes the tab label. Clicking a tab jumps straight to that
section — flipping every page in between as one animated chunk, the
way flipping to a bookmark in a real book grabs a wad of pages at
once rather than leafing through them one at a time. Loose images
left directly in `pages/` (not inside a numbered subfolder) are
treated as untabbed front matter and come before the first tab.

## Editing the intro line

The top-left greeting reads "Hi there! I'm Javier a \_\_\_", cycling
through the roles listed in `public/roles.txt` — one per line. Add,
remove, or reword them in that plain text file and refresh the page;
no code changes needed.

## Editing the per-shelf blurb

The header + body text on the right of the screen comes from
`src/shelves/<Shelf Name>/info.txt` — the first line is the header,
everything after that is the body. It swaps automatically whenever
the carousel brings a different shelf to the front. No file yet? The
panel falls back to the shelf's own folder name as the header and a
reminder of where to add the file as the body.

## How the project is organized

- `index.html` — the page shell, plus the slim reading toolbar
  (title + Prev/Next/Close). Pages themselves render in the 3D scene,
  not in HTML.
- `src/style.css` — page styling and the reading toolbar's look.
- `src/shelves/<Shelf Name>/pages/<slug>/` — one folder per project,
  where you drop that book's page images; `src/shelves/<Shelf
  Name>/papers/<slug>/` is the equivalent for that shelf's drawer.
- `src/main.js` — everything else, commented in twelve sections. The
  ones you'll touch most:
  2. **Bookshelf data** (title/color/description/slug per book, and
  the `knownShelfNames` list) — 3. Shared cabinet geometry — 4.
  Texture helpers — 5. **The bookshelf factory** (boards, books,
  drawer, legs) — 6. **The carousel** (slot layout, floor arrows,
  `navigateCarousel()`) — 7. The open-book reading view — 8.
  Opening/closing a book — 9. Shelf pull-out/push-back — the rest is
  click handling and boilerplate.

## How the pieces fit together

- **Shelf width & rows**: controlled by one constant, `booksPerRow`,
  near the top of section 3. Every bookshelf in the carousel builds
  the same number of rows — sized off whichever shelf has the most
  projects — so they all read as identical furniture. Books fill each
  row starting from the left edge (`leftEdgeX`), not centered.
- **Taller books**: `bookHeight` in the same section.
- **Spine text**: `createSpineTexture()` draws each title onto a
  canvas.
- **Page auto-loading**: `import.meta.glob(...)` in section 2b scans
  `src/shelves/*/pages/*/pages/**/*.{png,jpg,jpeg,webp}` (and the
  equivalent `cover/` and `papers/` patterns) at build/dev time and
  groups matches by shelf, then by project folder name. This is a
  Vite-specific feature — it only works for files under `src/`, which
  is why pages live there instead of in `public/`.
- **The carousel**: every shelf is built once by `buildBookshelf()`
  (section 5) and placed in its own evenly-spaced "slot" around
  `carouselGroup` (section 6). The floor arrows call
  `navigateCarousel()`, which rotates the whole group by one slot and
  updates which shelf is "active" (the only one whose books/drawer
  respond to clicks — see `activeShelf` in section 11).
- **The open book**: `buildOpenBook()` builds a fresh set of hinged
  pages every time you open a book. Each page is a `THREE.Group`
  (the "hinge") pivoting at the spine, with the actual page mesh
  offset to one side of it — rotating the hinge 180° swings the page
  from the right-hand ("unread") stack to the left-hand ("read") one,
  the same way a real page moves.

## Known simplifications (worth knowing about, not bugs)

- A flipped page's *back* side is a plain color, not a mirrored image
  — you're not meant to see the back of a page from the reading
  camera angle, so this wasn't worth the extra complexity yet.
- Pages are fully opaque, thin boxes rather than paper-thin curved
  sheets — a nice detail to chase later, not needed for the mechanic
  to work.

## Suggested build order from here

1. Add your real projects (title/color/description/slug) and drop
   their page images into the matching
   `src/shelves/<Shelf Name>/pages/<slug>/` folder.
2. Try a couple of values for `booksPerRow` and `bookHeight` to see
   what proportions look best once there's real content on the spines.
3. Add a subtle page-turn sound or a slight arc/lift mid-flip (a
   second GSAP tween on the hinge's position, timed alongside the
   rotation) for extra feel.
4. Consider a small camera-shake or dust-mote effect on open, if you
   want the reveal to feel more "special."

## Deploying for grading

`npm run build` produces a static `dist/` folder — push that to
Vercel, Netlify, or GitHub Pages for the public hosted link your
proposal commits to.
