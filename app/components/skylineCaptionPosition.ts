export const SKYLINE_CAPTIONS = {
  lahore: "Lahore, Pakistan",
  toronto: "Toronto, Canada",
  nyc: "New York, USA",
  waterloo: "Waterloo, Canada",
} as const;

export const SKYLINE_SONGS = {
  lahore: {
    title: "Longing",
    artist: "Nusrat Fateh Ali Khan and Michael Brook",
    href: "https://open.spotify.com/track/2IVTadJg1X3ZjlHI5dLh9r",
  },
  toronto: {
    title: "Know Yourself",
    artist: "Drake",
    href: "https://open.spotify.com/track/1d9AWpbn0IF95ZlgsfqAKE",
  },
  nyc: {
    title: "Theme From New York, New York",
    artist: "Frank Sinatra",
    href: "https://open.spotify.com/track/5EIXjYOsrrqf2VYmL9GReV",
  },
  waterloo: null,
} as const;

// Center the replacement cursor on the pointer, keeping all text onscreen.
export function positionSkylineCaption(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const gutter = 12;
  return {
    x: Math.max(gutter, Math.min(x - width / 2, viewportWidth - width - gutter)),
    y: Math.max(gutter, Math.min(y - height / 2, viewportHeight - height - gutter)),
  };
}

// Keep pointer movement outside React and avoid synchronous layout reads in the
// hot path. The small label is measured only when its text or font size changes.
export function createSkylineCaptionController(
  caption: HTMLElement,
  label: HTMLElement,
  getViewport: () => { width: number; height: number },
) {
  let place: keyof typeof SKYLINE_CAPTIONS | null = null;
  let width = 0;
  let height = 0;
  let viewport = { width: 0, height: 0 };
  let visible = false;

  function move(x: number, y: number) {
    if (!visible) return;
    const position = positionSkylineCaption(x, y, width, height, viewport.width, viewport.height);
    caption.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
  }

  function hide() {
    visible = false;
    caption.dataset.visible = "false";
  }

  return {
    show(nextPlace: keyof typeof SKYLINE_CAPTIONS, x: number, y: number) {
      if (place !== nextPlace) {
        place = nextPlace;
        label.textContent = SKYLINE_CAPTIONS[place];
        width = caption.offsetWidth;
        height = caption.offsetHeight;
      }
      viewport = getViewport();
      visible = true;
      move(x, y);
      caption.dataset.visible = "true";
    },
    move,
    hide,
    invalidate() {
      hide();
      place = null;
    },
  };
}
