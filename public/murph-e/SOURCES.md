# Murph-E Arcade

## Assembly model

`model/arcade-machine-diagram.glb` and assembly metadata are copied from the user-supplied `arcade-machine-3d/model-2/` directory. The model geometry and offsets are unchanged. The local viewer adapts the model to article scrolling. Dimensions are estimated from photos. Three.js 0.180.0 is pinned in `package.json`, matching the original viewer’s r180 release. Its MIT attribution is retained in `model/LICENSE-three.txt`.

`npm run dev` and `npm run build` first bundle the viewer with esbuild into `model/viewer.bundle.js`. This generated file is ignored by Git and served locally with no CDN dependencies. After editing viewer sources during development, run `npm run build:murphe` or keep `npm run watch:murphe` running and reload the article.

## Blog photos

`photos/16-initial-design.webp` is a web-optimized copy of the user-provided `Downloads/Initial Design from murph-e.png`, placed before the cabinet construction story.

`photos/13-htn-facetime.webp` is a web-optimized copy of the user-provided `Downloads/htn facetime.png`, added beside the paragraph about the team's Thursday night call.

The images in `photos/` come from the user-provided `murphe-blog-photos.zip` in `Downloads/htncodex`. Only the numbered images referenced by the article are included; unused photos 02 and 09 are omitted. PNGs were converted to WebP for the website; the supplied SVG schematic is unchanged. The original archive is untouched.

## Interactive diagrams

The interactive diagrams in `diagrams/` come from the user-provided `murphe-media/diagrams/jev-reuse-flow.html` and `prompt-to-game.html`. Their visual content, embedded fonts, assets, and animation scripts are preserved. The export wrapper, unused CDN helpers, and duplicated generic styles were removed; the remaining shared resets are in `diagrams/base.css`, and a resize message was added to fit each diagram into the article.

## Inline previews

The CRT screen uses the user-provided `codex-clipboard-00cf47e8-fac8-42bb-b9f8-3678d4411344.png`, copied unchanged to `model/crt-screen.png`. Its curved glass material renders it in black and white with scanlines, animated static, edge shading, and a subtle refresh sweep. Animation pauses offscreen and respects reduced motion.

- `stickerbox-logo.svg`: official red wordmark from https://stickerbox.com/cdn/shop/files/Group.svg?v=1761750458, accessed September 27, 2026.
- `arcade-mockup.webp`: WebP conversion of the user-provided `ChatGPT Image Sept 24 2026 Arcade Mockup.png`, used for the smaller tabletop enclosure hover preview. The original image is untouched.

## Homepage preview

`/projects/murph-e-film.mp4` and `/projects/murph-e.webp` are derived from the user-provided `/Users/shayaanazeem/Downloads/AARON0827_film_clear_screen_3s_4K.mp4`. The full three-second clip is resized to 960×540, encoded as H.264 without audio, and rendered by the site's existing ASCII canvas. The still is taken at one second. The original video is untouched.

## Additional team photos

`photos/14-team-group.webp` is a 1600 × 1200 web version of IMG_1871, used in the article after the semifinalist paragraph. Unused full-resolution JPEG conversions are omitted from the site. Original HEIC files are untouched.

`photos/15-team-finale.webp` is a web-optimized copy of the user-provided `IMG_5534 2.jpg`, placed immediately before the closing thank-you.
