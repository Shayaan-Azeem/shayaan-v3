type SkylineImages = {
  newYork: HTMLImageElement;
  oneWorld: HTMLImageElement | null;
  cloud: HTMLImageElement | null;
  toronto: HTMLImageElement;
  minar: HTMLImageElement;
  mosque: HTMLImageElement;
  neighborhood: HTMLImageElement | null;
  brickEntrance: HTMLImageElement | null;
  waterlooE7: HTMLImageElement | null;
};

type SourceRect = { x: number; y: number; width: number; height: number };

export type SkylineLandmark = {
  id: string;
  place: "nyc" | "toronto" | "lahore" | "waterloo";
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type LandmarkCaption = Pick<SkylineLandmark, "id" | "place" | "name">;
type SkylineBounds = Pick<SkylineLandmark, "left" | "top" | "width" | "height">;

// Trace only the outer roof edge. White windows below it must remain opaque;
// treating every white pixel as transparent would fill them with buildings behind.
export function traceFacadeRoofline(pixels: Uint8ClampedArray, width: number, height: number) {
  const roofline = new Float32Array(width).fill(1);
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const offset = (y * width + x) * 4;
      if (pixels[offset + 3] > 127 && pixels[offset] + pixels[offset + 1] + pixels[offset + 2] < 576) {
        roofline[x] = y / height;
        break;
      }
    }
  }
  return roofline;
}

const rooflineCache = new WeakMap<HTMLImageElement, Float32Array>();

function facadeRoofline(image: HTMLImageElement, source: SourceRect) {
  const cached = rooflineCache.get(image);
  if (cached) return cached;
  // Each facade has one stable crop, read only once per loaded asset.
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, source.width, source.height);
  const roofline = traceFacadeRoofline(context.getImageData(0, 0, source.width, source.height).data, source.width, source.height);
  rooflineCache.set(image, roofline);
  return roofline;
}

function clipToRoofline(context: CanvasRenderingContext2D, roofline: Float32Array, width: number, height: number, left = 0, top = 0) {
  context.beginPath();
  context.moveTo(left, top + height);
  for (let x = 0; x < roofline.length; x += 1) {
    const roofY = top + roofline[x] * height;
    context.lineTo(left + x / roofline.length * width, roofY);
    context.lineTo(left + (x + 1) / roofline.length * width, roofY);
  }
  context.lineTo(left + width, top + height);
  context.closePath();
  context.clip();
}

// Sample local silhouette assets only when the footer resizes, not per frame.
export function sampleSkyline(
  images: SkylineImages,
  width: number,
  height: number,
  columns: number,
  rows: number,
  onLandmarks?: (landmarks: SkylineLandmark[]) => void,
  onWaterlooBounds?: (bounds: SkylineBounds | null) => void,
) {
  onWaterlooBounds?.(null);
  // Resizing or route transitions can briefly hide the footer entirely.
  if (width <= 0 || height <= 0 || columns < 1 || rows < 1) {
    onLandmarks?.([]);
    return new Float32Array(0);
  }
  const canvas = document.createElement("canvas");
  canvas.width = columns * 3;
  canvas.height = rows * 3;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const coverage = new Float32Array(columns * rows);
  if (!context) {
    onLandmarks?.([]);
    return coverage;
  }

  const landmarks: SkylineLandmark[] = [];

  context.scale(canvas.width / width, canvas.height / height);
  const baseline = height;
  const empireStateCenter = 0.17;

  // Keep the skyline's source proportions; an optional horizontal anchor lets
  // the NYC tower stay in place while its neighboring blocks fill out the city.
  const drawLandmark = (
    image: HTMLImageElement,
    source: SourceRect,
    center: number,
    targetHeight: number,
    anchor = 0.5,
    caption?: LandmarkCaption,
  ) => {
    const targetWidth = targetHeight * source.width / source.height;
    context.drawImage(
      image,
      source.x, source.y, source.width, source.height,
      width * center - targetWidth * anchor, baseline - targetHeight,
      targetWidth, targetHeight,
    );
    // Use the exact rendered geometry for interactions; no separate percentage
    // map that can drift when a landmark moves or the footer resizes.
    const bounds = {
      left: width * center - targetWidth * anchor,
      top: baseline - targetHeight,
      width: targetWidth,
      height: targetHeight,
    };
    if (caption) landmarks.push({ ...caption, ...bounds });
    return bounds;
  };

  // Use the complete surrounding NYC blocks, not an isolated tower cutout.
  // Use the same anchor for the city crop and tower's foreground profile.
  // End the background cluster before the CN Tower. Its transparent exterior
  // must stay open, otherwise an NYC high-rise fills in the tower's silhouette.
  context.save();
  context.beginPath();
  context.rect(0, 0, width * 0.225, height);
  context.clip();
  drawLandmark(
    images.newYork,
    { x: 500, y: 0, width: 1200, height: 655.917 },
    empireStateCenter,
    Math.min(height - 8, width * 0.205),
    (941 - 500) / 1200,
  );
  context.restore();
  // Separate flat elevations replace the crowded panoramic middle strip.
  // Vary the widths and roof heights, preserving source proportions without
  // perspective, skew, or extrusion. Slot limits keep the gaps on small screens.
  const middleGroups = [
    { source: { x: 1205, y: 690, width: 150, height: 400 }, center: 0.375, height: 0.52, width: 0.065 },
    { source: { x: 1355, y: 740, width: 250, height: 350 }, center: 0.455, height: 0.34, width: 0.065 },
    // Keep this roof below the homepage's overlapping project-label row.
    { source: { x: 1620, y: 715, width: 215, height: 375 }, center: 0.54, height: 0.48, width: 0.085 },
    { source: { x: 2070, y: 800, width: 240, height: 290 }, center: 0.63, height: 0.43, width: 0.08 },
  ];
  for (const group of middleGroups) {
    // E7 occupies the apartment's former center slots; retain a load fallback.
    if (images.waterlooE7 && (group.center === 0.455 || group.center === 0.54)) continue;
    drawLandmark(
      images.toronto,
      group.source,
      group.center,
      Math.min(height * group.height, width * group.width * group.source.height / group.source.width),
    );
  }

  // A continuous street-level layer connects the landmarks without competing
  // with their rooflines. Draw it in front of the taller city clusters so the
  // foreground windows stay visible. Alternate the strip to vary the blocks.
  const roofline = images.neighborhood
    ? facadeRoofline(images.neighborhood, { x: 0, y: 153, width: 2172, height: 571 })
    : null;
  if (images.neighborhood && roofline) {
    const sourceHeight = 571;
    // A lower central street row leaves breathing room between the taller
    // groups; the eastern neighborhood stays below the mosque's domes.
    for (const [start, end, roofHeight] of [[0, 0.34, 0.32], [0.34, 0.69, 0.22], [0.69, 1, 0.18]]) {
      const streetHeight = height * roofHeight;
      const streetWidth = streetHeight * 2172 / sourceHeight;
      context.save();
      context.beginPath();
      context.rect(width * start, 0, width * (end - start), height);
      context.clip();
      for (let left = width * start, tile = 0; left < width * end; left += streetWidth, tile += 1) {
        context.save();
        context.translate(left + (tile % 2 ? streetWidth : 0), baseline - streetHeight);
        context.scale(tile % 2 ? -1 : 1, 1);
        // Exclude the asset's white sky instead of painting a rectangular gap
        // over the taller skyline. Interior windows are still drawn as white.
        clipToRoofline(context, roofline, streetWidth + 0.5, streetHeight);
        context.drawImage(images.neighborhood, 0, 153, 2172, sourceHeight, 0, 0, streetWidth + 0.5, streetHeight);
        context.restore();
      }
      context.restore();
    }
  }

  // One World Trade Center is a distinct landmark to the left of the existing
  // Empire State profile, not a duplicate of its stepped Art Deco crown.
  if (images.oneWorld) {
    drawLandmark(
      images.oneWorld,
      { x: 0, y: 0, width: images.oneWorld.naturalWidth, height: images.oneWorld.naturalHeight },
      0.095,
      Math.min(height - 8, width * 0.225),
      0.5,
      { id: "one-world", place: "nyc", name: "One World Trade Center" },
    );
  }

  // Restore the Empire State Building's narrow foreground profile over the street.
  drawLandmark(
    images.newYork,
    { x: 895, y: 0, width: 92, height: 655.917 },
    empireStateCenter,
    Math.min(height - 8, width * 0.205),
    0.5,
    { id: "empire-state", place: "nyc", name: "Empire State Building" },
  );
  // The Toronto source joins a neighboring roof to the shaft at y=755.47.
  // Keep the crown untouched, then follow the shaft's existing taper down to
  // the baseline instead of including that extra building in the tower crop.
  const cnHeight = Math.min(height - 8, width * 0.19);
  const cnScale = cnHeight / 990;
  const cnLeft = width * 0.27 - 115 * cnScale / 2;
  const cnTop = baseline - cnHeight;
  context.save();
  context.beginPath();
  for (const [index, [x, y]] of [
    [570, 0], [685, 0], [685, 755.47], [651.75, 755.47],
    [659.04, 990], [570, 990],
  ].entries()) {
    const targetX = cnLeft + (x - 570) * cnScale;
    const targetY = cnTop + y * cnScale;
    if (index === 0) context.moveTo(targetX, targetY);
    else context.lineTo(targetX, targetY);
  }
  context.closePath();
  context.clip();
  drawLandmark(
    images.toronto,
    { x: 570, y: 0, width: 115, height: 990 },
    0.27,
    cnHeight,
    0.5,
    { id: "cn-tower", place: "toronto", name: "CN Tower" },
  );
  context.restore();

  const minarHeight = Math.min(height - 8, width * 0.145);
  drawLandmark(
    images.minar,
    { x: 0, y: 0, width: images.minar.naturalWidth, height: images.minar.naturalHeight },
    0.72,
    minarHeight,
    0.5,
    { id: "minar", place: "lahore", name: "Minar-e-Pakistan" },
  );
  drawLandmark(
    images.mosque,
    { x: 40, y: 0, width: 2560, height: 707 },
    // Enlarge proportionally, keeping the rightmost minaret inside the footer.
    0.83,
    Math.min(height - 8, width * 0.32 * 707 / 2560),
    0.5,
    { id: "mosque", place: "lahore", name: "Badshahi Mosque" },
  );

  if (images.brickEntrance) {
    // Put the apartment on the NYC street in front of both towers.
    const apartmentCenter = 0.145;
    const image = images.brickEntrance;
    // Trim the source's outer whitespace so the doors land on the baseline.
    const source = { x: 25, y: 34, width: 1581, height: 884 };
    const roofline = facadeRoofline(image, source);
    if (roofline) {
      const facadeHeight = Math.min(height * 0.44, width * 0.16 * source.height / source.width);
      const facadeWidth = facadeHeight * source.width / source.height;
      const left = width * apartmentCenter - facadeWidth / 2;
      context.save();
      // Above the street row, with opaque windows and fanlight. Clip only the
      // exterior sky so the roof cannot erase neighboring silhouettes.
      clipToRoofline(context, roofline, facadeWidth, facadeHeight, left, baseline - facadeHeight);
      drawLandmark(image, source, apartmentCenter, facadeHeight, 0.5, {
        id: "apartment", place: "nyc", name: "New York apartment",
      });
      context.restore();
    }
  }

  if (images.waterlooE7) {
    const image = images.waterlooE7;
    const bounds = drawLandmark(
      image,
      { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight },
      0.5,
      Math.min(height * 0.44, width * 0.16 * image.naturalHeight / image.naturalWidth),
      0.5,
      { id: "waterloo-e7", place: "waterloo", name: "Waterloo Engineering 7" },
    );
    onWaterlooBounds?.(bounds);
  }

  onLandmarks?.(landmarks);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      let ink = 0;
      for (let y = 0; y < 3; y += 1) {
        for (let x = 0; x < 3; x += 1) {
          const offset = ((row * 3 + y) * canvas.width + column * 3 + x) * 4;
          const darkness = 1 - (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 765;
          ink += darkness * pixels[offset + 3] / 255;
        }
      }
      coverage[row * columns + column] = ink / 9;
    }
  }
  return coverage;
}

export async function loadSkylineImages(): Promise<SkylineImages> {
  const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load skyline: ${src}`));
    image.src = src;
  });
  const [newYork, toronto, minar, mosque, neighborhood, brickEntrance, oneWorld, cloud, waterlooE7] = await Promise.all([
    load("/skyline/new-york.svg"),
    load("/skyline/toronto.svg"),
    load("/skyline/minar-e-pakistan.svg"),
    load("/skyline/badshahi-mosque.svg"),
    // Preserve the existing skyline if this secondary facade fails to load.
    load("/skyline/neighborhood.webp").catch(() => null),
    load("/skyline/brick-entrance.webp").catch(() => null),
    load("/skyline/one-world-trade-center.svg").catch(() => null),
    load("/skyline/cumulus-cloud.webp").catch(() => null),
    load("/skyline/waterloo-e7.svg").catch(() => null),
  ]);
  return { newYork, toronto, minar, mosque, neighborhood, brickEntrance, oneWorld, cloud, waterlooE7 };
}
