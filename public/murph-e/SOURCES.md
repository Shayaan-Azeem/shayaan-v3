# Murph-E Arcade

## Assembly model

`model/arcade-machine-diagram.glb` and assembly metadata are derived from the user-supplied `arcade-machine-3d/model-2/` directory. The model uses lossless Meshopt buffer compression and lossless WebP textures. A decode comparison verifies identical geometry attributes, triangle indices, node transforms, assembly metadata, and texture pixels. The model shrinks from 6,799,588 to 3,544,572 bytes; no geometry simplification or quantization is applied. The local viewer adapts the model to article scrolling. Dimensions are estimated from photos. Three.js 0.180.0 is pinned in `package.json`, matching the original viewer’s r180 release. Its MIT attribution is retained in `model/LICENSE-three.txt`; the bundled Meshopt decoder’s attribution is in `model/LICENSE-meshoptimizer.txt`.

`npm run dev` and `npm run build` first bundle the viewer with esbuild into `model/viewer.bundle.js`. This generated file is ignored by Git and served locally with no CDN dependencies. After editing viewer sources during development, run `npm run build:murphe` or keep `npm run watch:murphe` running and reload the article.

The viewer starts from the article’s initial HTML, preloads its large assets, and loads the model, assembly data, and screen texture concurrently. A readiness handshake also handles loading before React hydrates. Slow connections are allowed to finish without a visible loading label; only actual loading/rendering errors select the fallback.

To regenerate the optimized model and CRT texture from the original files (authoring only; these packages are not site dependencies):

```sh
npm install --prefix /tmp/murphe-opt-tools --no-audit --no-fund @gltf-transform/core@4.5.1 @gltf-transform/extensions@4.5.1 meshoptimizer@1.1.0
node scripts/optimize-murphe.cjs /path/to/original.glb /path/to/original-screen.png /tmp/murphe-opt-tools
```

The script rejects the served model as its input and verifies a lossless model round trip before saving. The original assets remain available in commit `04b9854` and the user’s supplied source files.

## Blog photos

`photos/16-initial-design.webp` is a web-optimized copy of the user-provided `Downloads/Initial Design from murph-e.png`, placed before the cabinet construction story.

`photos/13-htn-facetime.webp` is a web-optimized copy of the user-provided `Downloads/htn facetime.png`, added beside the paragraph about the team's Thursday night call.

The images in `photos/` come from the user-provided `murphe-blog-photos.zip` in `Downloads/htncodex`. Only the numbered images referenced by the article are included; unused photos 02 and 09 are omitted. PNGs were converted to WebP for the website; the supplied SVG schematic is unchanged. The original archive is untouched.

## Interactive diagrams

The interactive diagrams in `diagrams/` come from the user-provided `murphe-media/diagrams/jev-reuse-flow.html` and `prompt-to-game.html`. Their visual content, embedded fonts, assets, and animation scripts are preserved. The export wrapper, unused CDN helpers, and duplicated generic styles were removed; the remaining shared resets are in `diagrams/base.css`, and `diagrams/resize.js` fits each iframe to its content, reconnecting its observer after BFCache restoration.

## Inline previews

The CRT screen uses the user-provided `codex-clipboard-00cf47e8-fac8-42bb-b9f8-3678d4411344.png`, resized to 768 × 576 and encoded at WebP quality 88 in `model/crt-screen.webp` (37,802 bytes instead of 2,106,333). Its curved glass material renders it in black and white with scanlines, animated static, edge shading, and a subtle refresh sweep. Animation pauses offscreen and respects reduced motion.

- `stickerbox-logo.svg`: official red wordmark from https://stickerbox.com/cdn/shop/files/Group.svg?v=1761750458, accessed September 27, 2026.
- `arcade-mockup.webp`: WebP conversion of the user-provided `ChatGPT Image Sept 24 2026 Arcade Mockup.png`, used for the smaller tabletop enclosure hover preview. The original image is untouched.

## Homepage preview

`/projects/murph-e-film.mp4` and `/projects/murph-e.webp` are derived from the user-provided `/Users/shayaanazeem/Downloads/AARON0827_film_clear_screen_3s_4K.mp4`. The full three-second clip is resized to 960×540, encoded as H.264 without audio, and rendered by the site's existing ASCII canvas. The still is taken at one second. The original video is untouched.

## Additional team photos

`photos/14-team-group.webp` is a 1600 × 1200 web version of IMG_1871, used in the article after the semifinalist paragraph. Unused full-resolution JPEG conversions are omitted from the site. Original HEIC files are untouched.

`photos/15-team-finale.webp` is a web-optimized copy of the user-provided `IMG_5534 2.jpg`, placed immediately before the closing thank-you.

## Shared-link preview

`app/murph-e/opengraph-image.png` is the user-provided machine photo (`codex-clipboard-7deef43b-47f0-4d42-9adb-a9a33d736c03.png`), used for Open Graph and Twitter link previews. The Fieldnotes listing retains its team thumbnail.
