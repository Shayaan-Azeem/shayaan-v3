# Skyline artwork

Public-domain / CC0 and attributed CC BY landmark silhouettes, plus generated architectural facades, sampled into ASCII characters at runtime.
The footer is a personal composite, not one geographically continuous skyline.

## Rounded clouds

`cumulus-cloud.webp` was generated once using the built-in image-generation tool. The original 1983 × 793 bitmap is encoded as quality-92 WebP without visual edits (approximately 16 KiB). At runtime, crop `(28, 23, 1928, 708)` excludes white padding and samples the actual five-lobed cumulus silhouette. Four differently sized, alternately mirrored copies travel horizontally at 4–6.5 text columns per second and wrap completely offscreen. The artwork's proportions account for rectangular ASCII character cells. Clouds remain behind the skyline and its windows, and follow the footer's visibility and reduced-motion controls.

### Built-in imagegen prompt

Use case: stylized-concept
Asset type: original decorative bitmap mask for a tiny ASCII skyline animation.
Primary request: exactly one solid black, puffy cumulus cloud silhouette on a pure white background.
Subject: instantly recognizable cloud shape formed by 4–5 large smooth rounded lobes, with one highest central lobe and smaller shoulder puffs. Broad gently rounded, mostly flat bottom. Modest natural asymmetry. One completely connected solid mass.
Style/medium: simple flat two-color filled silhouette, crisp smooth edge, entirely black interior against entirely white background.
Composition/framing: broad landscape canvas approximately 2.5:1. The cloud itself is about 2.5 times as wide as it is tall. Fill the canvas with only tiny 2% white margins around the complete cloud, never cropped. The silhouette must remain crisp and unmistakably cloud-shaped when reduced to 100–160 pixels wide and 40–60 pixels tall.
Constraints: one cloud only; no detached wisps; no internal detail; no holes; no gray shading; no texture; no outline-only drawing; no 3D; no scenery, sky, ground, shadows, text, UI, or watermark.

## Landmark silhouettes

- `new-york.svg`: [New York Cityscape Silhouette](https://openclipart.org/detail/279645/new-york-cityscape-silhouette), [SVG](https://openclipart.org/download/279645). The Empire State Building's stepped-crown profile and its surrounding blocks are sampled together; its narrow foreground profile is restored over the street-level layer at 17% of the footer width.
- `one-world-trade-center.svg`: One World Trade Center silhouette adapted from [New York Bldg. Height Comparison.svg](https://commons.wikimedia.org/wiki/File:New_York_Bldg._Height_Comparison.svg) by **FOX 52**, licensed [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). [Original SVG](https://upload.wikimedia.org/wikipedia/commons/f/f3/New_York_Bldg._Height_Comparison.svg). Changes: the original tower's 13 shape geometries were extracted, labels and the comparison chart removed, cropped to `98 28 51 302`, and gray fills normalized to black. The transparent silhouette is rendered separately to the left of the Empire State Building at 9.5% of the footer width, preserving its taper, flat roof, and long spire. Source and license attribution are also embedded in the SVG metadata.
- `toronto.svg`: [Toronto Canada Cityscape Skyline Silhouette](https://openclipart.org/detail/311064/toronto-canada-cityscape-skyline-silhouette), [SVG](https://openclipart.org/download/311064). Separate flat-elevation crops with varied heights and widths flank the central brick facade, with gaps between their upper profiles and a lower connecting street row. Four crops remain as a fallback if the brick facade fails to load. The CN Tower retains its position to the left. A locally added observation-deck window band and shaft highlight improve its detail without changing the silhouette.
- `minar-e-pakistan.svg`: [Minar-e-Pakistan by Firkin](https://openclipart.org/detail/300167/minarepakistan), [SVG](https://openclipart.org/download/300167).
- `badshahi-mosque.svg`: [Silhouette of the Badshahi Mosque](https://www.clipsafari.com/clips/o279592-silhouette-of-the-badshahi-mosque), [SVG](https://images.clipsafari.com/t5g7yz8qvrcqkzsf2v7zkyodr1ev?filename=silhouette-of-the-badshahi-mosque.svg).

[Openclipart public-domain policy](https://openclipart.org/share). ClipSafari lists its asset as CC0.
External SVG DOCTYPE declarations were removed; the files have no scripts or external references. The mosque silhouette has locally added opaque white arcade openings, a central portal, facade courses, and minaret bands to preserve architectural detail in ASCII.

## SoHo facade

`soho-facade.png` was generated with the built-in image tool from the user's supplied SoHo building photograph (`Screenshot 2026-09-11 at 1.01.33 PM.png`). It is a stylized architectural reference, not an exact survey of the building. The runtime frames the facade within the raster at `(52, 43, 1208, 1086)`, excluding the generated exterior checkerboard padding. Opaque white window panes remain visible as gaps in the ASCII texture.

### Generation prompt

Use case: stylized-concept
Asset type: monochrome raster facade mask for a small animated ASCII skyline footer, displayed only 110–300 pixels tall.
Input images: Image 1 is an architectural SUBJECT REFERENCE ONLY: the main six-storey red-brick SoHo building in the photograph. Derive a new clean mask, not a photographic edit.
Primary request: Create one clean front-on orthographic elevation of this broad, six-storey SoHo brick building, including five regular upper window rows and broad ground-floor shopfronts. Preserve its recognizable low-rise warehouse proportions, brick masonry, many regular window bays, broad rectangular multi-pane sash windows, thick stone lintels and sills, horizontal masonry bands, and pronounced flat projecting roof cornice. This is one main building only.
Style/medium: Bold simplified architectural stencil mask. Use SOLID PURE BLACK for the building mass. Use SOLID OPAQUE PURE WHITE for large window panes, simplified horizontal brick/masonry joints, a few staggered vertical brick joints, and simplified architectural detail gaps. Window mullions stay black. Make window panes large and details thick so they survive very small raster sampling into ASCII. Reduce brick detail density to essential readable courses. No shading or gradients.
Transparency semantics: Exterior pixels outside the whole building silhouette must be genuinely transparent. The building interior must be opaque; white window panes and white masonry joints MUST remain opaque pure white, NEVER transparent. The white shapes mask out other buildings behind this foreground facade.
Composition/framing: Perfectly front-facing flat orthographic elevation, square-ish or slightly landscape canvas. Full building nearly fills frame with tight approximately 2% outer margins. Entire roof cornice visible, entire flat baseline visible, straight parallel horizontal and vertical edges, no perspective. Broad repeated bays across its width.
Constraints: Similar shape and architectural material to the reference SoHo brick facade. Simplify for a small ASCII renderer while retaining the facade rhythm. Keep entire silhouette and all six storeys visible.
Avoid: sky, street, sidewalk, cars, people, words, signs, lettering, logos, shadows, grayscale shading, photo texture, ASCII characters, other buildings, perspective, vanishing points, ornate fantasy features, generic skyscraper proportions, transparent windows.

The generated result has four upper window rows plus storefronts, rather than five upper rows; it is used as a SoHo-inspired facade rather than an exact replica.

## Waterloo and neighborhood

`waterloo-atrium.webp` and `neighborhood.webp` were generated with the built-in image tool. The Waterloo asset uses the user-supplied university building photograph as a subject reference; the neighborhood is an invented row of ordinary small buildings. Both originals are 2172 × 724, encoded as WebP at quality 92 for a combined transfer size of approximately 209 KiB. The original generated PNGs were retained outside the repository.

Runtime crops remove exterior padding. Smaller buildings tile along the ground in front of the taller skyline clusters, with a lower roofline around the mosque. SoHo, the NYC tower, CN Tower, Minar-e-Pakistan, and mosque retain separate upper profiles. The Waterloo atrium is no longer rendered or loaded; its original asset and generation notes are retained for provenance.

The neighborhood's opaque white exterior is excluded at render time by a cached clipping profile traced from its roof edge. Only pixels below that edge are drawn, preserving opaque window details without erasing the taller skyline behind it. The source artwork and animated texture are unchanged.

### Built-in imagegen prompts

#### Waterloo

Use case: stylized-concept
Asset type: high contrast architectural raster mask for an ASCII website skyline footer.
Primary request: Generate a new standalone monochrome architectural stencil, using the attached image ONLY as a subject reference for the recognizable Waterloo university building. It is not a photo edit.
Subject: a broad curved glass atrium with a clearly visible substantial window grid, three distinctive large arched exterior ventilation pipes rising from the facade and bending into the curved roof, and staggered low masonry blocks in front. Preserve the recognizable curved-roof structure, pipe shapes, and offset low foreground wings from the reference. Simplified nearly front elevation with just enough three-quarter perspective to show the staggered volumes.
Style/medium: bold architectural stencil, black building masses, large opaque pure-white rectangular window panes, bold white panel joints, clean edges. Maintain enough facade detail to remain legible when displayed approximately 300 pixels wide and 100 pixels tall. Use fewer larger panes instead of tiny fine details.
Composition: wide landscape about 3:1. Tight trim around building, building occupies nearly all canvas width and reaches baseline at bottom with no bottom padding. Whole roof and pipes visible.
Color palette: ONLY pure black and pure white. Background exterior is pure white, absolutely no checkerboard or simulated transparency. Window panes are opaque white.
Avoid: people, bicycles, trees, signs, letters, text, gray, gradient, shadows outside the building, tiny hatching, fine noise, ground plane, surrounding buildings.

#### Streetscape

Use case: stylized-concept
Asset type: high contrast architectural raster mask for an ASCII website skyline footer.
Primary request: a continuous varied streetscape strip of connected ordinary little buildings, coherently arranged across the entire width on one flat baseline.
Subject: 12 to 16 visually distinct short buildings of two to six storeys, including narrow brick townhouses, low office blocks, small shopfront buildings, both peaked and flat roofs, modest cornices, large clearly spaced windows and doors. Stagger the heights and roof silhouettes so it feels like an interesting real neighborhood. Adjacent buildings touch; no empty lots or blank vertical gaps down to the baseline. Give each short block distinctive proportions and facade composition instead of repeating identical units.
Style/medium: bold monochrome architectural stencil. Solid black building masses, opaque white large rectangular windows and boldly simplified architectural joints. Moderate facade detail that remains legible at a small web display size.
Composition: wide 3:1 landscape. Buildings reach both side edges and bottom edge, no side or bottom padding. Highest ordinary roof about 70 percent of canvas height. Continuous black mass along bottom, irregular skyline above.
Color palette: ONLY pure black and pure white. Pure-white exterior sky background, absolutely no checkerboard or simulated transparency.
Avoid: landmark towers, minarets, domes, skyscrapers, people, trees, signs, labels, letters, text, cars, gray, gradients, thin hatching, tiny detail, fine noise, disconnected floating buildings.

## Central brick building and arched entrance

`brick-entrance.webp` was generated once with the built-in image-generation tool from three user-supplied reference photographs: `Screenshot 2026-09-11 at 1.46.17 PM.png`, `Screenshot 2026-09-11 at 1.43.58 PM.png`, and the front-door closeup `Screenshot 2026-09-11 at 1.43.14 PM.png`. It combines the architectural references into a flat, straight-on elevation, not an exact measured survey. The arched entrance retains its fanlight, pale keystone, and double doors.

The original is 1632 × 964 pixels. This WebP is a quality-92 encoding without visual edits (approximately 88 KiB). The runtime crop `(25, 34, 1581, 884)` removes outer whitespace; the cached roofline clipping preserves the white windows and doorway while excluding exterior sky. The facade occupies the middle slot in front of the street row, replacing two filler groups. Its height and width are capped to clear the overlapping project captions and neighboring buildings.

### Built-in imagegen prompt

Use case: stylized-concept
Asset type: black-and-white source artwork for a small ASCII skyline building.
Primary request: Synthesize the building in the three reference photographs into ONE coherent, completely flat, straight-on architectural front elevation. Preserve its recognizable architecture while simplifying for clear legibility at approximately 220 pixels wide by 130 pixels high.
Input images: Image 1 is the architectural reference for the long brick facade and connected entrance wing with roof dormers. Image 2 is the architectural reference for the five-storey main block, tall narrow sash windows, stone ground-floor base, and decorative cornice. Image 3 is a detail reference for the round-arched entrance, pale keystone, radiating fanlight, double glazed doors, and narrow sidelights. These are subject references only; do not copy their photographic viewpoint or surroundings.
Subject: A five-storey historic brick main block occupying most of the composition, with four aligned upper rows of tall narrow sash windows above a clearly defined stone ground-floor base. Retain the strong decorative projecting cornice as a flat horizontal stepped band with simple dentil/bracket cutouts, and the rhythm of vertical brick piers. Integrate a modest connected entrance wing to the right, with its characteristic round brick arch, white keystone, large semicircular fanlight with radiating mullions, glazed double doors and sidelights. The wing may include its small roof dormers as seen straight on. Keep architectural proportions coherent and the entrance clearly readable.
Style/medium: Crisp simplified 2D architectural silhouette artwork, solid fills, sharp edges, bold white window and door cutouts within black masonry. All facade surfaces lie in a single flat plane.
Composition/framing: Landscape canvas approximately 1.7:1. Center the complete building, fill the canvas with only a tiny white margin. Entire roof silhouette and horizontal building base visible. Every horizontal architectural edge is exactly horizontal, every vertical is exactly vertical. Elevation projection, perfectly head-on, zero perspective, zero visible side wall, zero receding roof or ground plane, zero three-dimensional depth.
Color palette: ONLY pure solid black and pure solid white. Black masonry and roof silhouette; white windows, door glazing, keystone and selected architectural cutout details; pure white empty background.
Constraints: Recognizable large-scale architecture and clean readable window rhythm are more important than fine texture. Omit individual brick texture except a few essential base courses if useful. No shading, no gray, no gradients, no reflections, no cast shadows, no atmospheric effects, no sketch hatching. No sky, street, pavement, landscape, trees, people, cars, lamps, fences, signs, text, numbers, logos, watermark, or border. Produce one building elevation only, not a sheet of alternatives.


## Waterloo Engineering 7 front elevation

`waterloo-e7.svg` is an original simplified SVG elevation drawn from the two E7 photographs supplied by the user on September 11, 2026. It preserves the repeated triangular facade panels, central glass atrium, right wing, and entrance canopy as flat front-facing geometry. It uses opaque white glazing and black structural detail for the ASCII sampler, with transparent exterior space. It replaces the old `waterloo-atrium.webp` artwork in the center; the apartment remains in the NYC foreground. The SoHo facade is no longer loaded or drawn.
