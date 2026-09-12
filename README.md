# Shayaan’s portfolio

A personal portfolio built with Next.js 16, React 19, TypeScript, and CSS modules.

## Development

Use Node.js 22.18+ or 24 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Before changing Next.js APIs, read the installed documentation in `node_modules/next/dist/docs/` as described in `AGENTS.md`.

## Validation

```sh
npm test
npm run typecheck
npm run build
npm start
```

The focused regression tests cover lazy video loading, offscreen/background pausing, reduced-motion stills, autoplay recovery, and cleanup. The build verifies and prerenders the public routes. Google fonts are self-hosted by Next.js; an uncached build needs access to Google Fonts.

For browser QA, check home and projects at desktop, 390px, and 320px widths. Expand the biography, toggle every project category off and restore all, pause/play each video treatment, scroll media offscreen and back, resize paused canvases, and verify keyboard navigation and previews. Test with reduced motion enabled. Repository-specific guidance lives in `.agents/skills/testing-portfolio/SKILL.md`.

## Content and structure

- `app/HomeView.tsx`: introduction and featured projects.
- `app/*/*View.tsx`: bundled page content; `page.tsx` files preserve direct-entry HTML and metadata.
- `app/components/BackpackSite.tsx`: eager page registry, local navigation state, history, and scroll restoration.
- `app/lib/backpackNavigation.ts`: route metadata and synchronous navigation rules.
- `app/projects/data.ts`: project content, media, categories, and featured flags.
- `app/fieldnotes/data.ts`, `app/events/data.ts`, `app/favourites/data.ts`: writing, events, and favourites.
- `app/components/Layout.tsx`: shared navigation and accessible content target.
- `app/components/videoPlayback.ts`: shared native/canvas playback lifecycle.
- `app/components/pixelCanvas.ts`: sampled ASCII and halftone rendering.
- `app/components/AsciiFooter.tsx`: decorative skyline, loaded and animated only when visible.
- `public/`: local images and videos. Skyline attribution is in `public/skyline/SOURCES.md`.

Each route prerenders its complete initial page on the server, then hydrates the same client bundle containing all six pages. Client components handle filters, media, clipboard feedback, previews, and animation. Each route has its own title and description, including after local navigation. Keep new media dimensions and responsive `sizes` aligned with its displayed layout.

## Backpack navigation

The six small static pages travel together. Normal internal clicks synchronously render the selected view from local state, then update the address bar with the native History API. There are no route fetches, lazy page imports, loading skeletons, or navigation transitions. Browser back/forward restores the view and its scroll position. Real links preserve direct URLs, refresh, opening new tabs, and navigation before JavaScript hydrates. Only the active view mounts, so inactive pages do not run media or animation effects.

This is a content/UI backpack, not a single-file offline copy of the entire media library. Full images, videos, fonts, and skyline assets stay separate; tiny video posters are embedded so cards appear before media loads. External essays and project destinations still require their own requests. A first visit or refresh still needs the host. Static text and controls can navigate after the initial bundle has loaded even if the host becomes unavailable.

The September 2026 production build loads approximately **237 KB gzipped of initial JavaScript**, including Next.js and React, versus 197 KB for the previous homepage. The build runs `npm run check:backpack`, which verifies that every public page loads the same initial scripts and enforces a **250 KB gzip budget**. This measurement includes the inline video posters and excludes HTML, CSS, fonts, and separately loaded media. If content grows beyond a small static collection, reconsider eager bundling rather than silently raising the budget.

When adding a page, register its metadata in `backpackNavigation.ts`, eagerly import its view into `BackpackSite.tsx`, and keep a server `page.tsx` entry for direct visits. Do not import filesystem, credentials, user-specific data, or server-only modules into the view graph. Re-run the build and verify internal navigation, browser history, direct links, and project filters.

Videos respect reduced motion by default; visitors can explicitly play them. They pause outside the viewport and in background tabs. Small first-frame WebP posters are embedded in the initial HTML and page bundle, so video cards have a preview before hydration or video download. Posters include the same ASCII/halftone treatment and stay behind the canvas until it paints a decoded frame. Native videos also use the poster attribute. Playback still loads separately when visible.

After changing a video or effect, regenerate `app/projects/videoPosters.json` with `node --experimental-strip-types scripts/generate-video-posters.mjs`. This authoring script requires `ffmpeg` and `@napi-rs/canvas`; an existing canvas package path can be supplied as its first argument. These tools are not needed to build or serve the site.
