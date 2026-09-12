export const BACKPACK_ROUTES = {
  "/": {
    title: "Shayaan Azeem",
    description: "Shayaan Azeem is a software engineer studying Math and Philosophy at the University of Waterloo. Explore his projects, writing, and communities.",
  },
  "/projects": {
    title: "Projects — Shayaan Azeem",
    description: "Software, AI, robotics, and communities built by Shayaan Azeem.",
  },
  "/forus": {
    title: "Forus — Shayaan Azeem",
    description: "Building browser agents, agent harnesses, and backend infrastructure at Forus to help patients get their medication faster.",
  },
  "/fieldnotes": {
    title: "Fieldnotes — Shayaan Azeem",
    description: "Notes and essays by Shayaan Azeem on building, learning, and life.",
  },
  "/philosophy": {
    title: "Philosophy — Shayaan Azeem",
    description: "Shayaan Azeem's philosophy on effort and ambition.",
  },
  "/events": {
    title: "Events — Shayaan Azeem",
    description: "Events hosted by Shayaan Azeem.",
  },
  "/favourites": {
    title: "Favourites — Shayaan Azeem",
    description: "A collection of Shayaan Azeem’s favourite books, films, essays, and videos.",
  },
} as const;

export type BackpackPath = keyof typeof BACKPACK_ROUTES;
export type ScrollPosition = { x: number; y: number };

export function getBackpackPath(pathname: string): BackpackPath | null {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return Object.hasOwn(BACKPACK_ROUTES, path) ? path as BackpackPath : null;
}

export function isPlainNavigation(event: {
  defaultPrevented: boolean;
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}, target: string, download: boolean) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey &&
    !event.ctrlKey && !event.shiftKey && !event.altKey &&
    (!target || target === "_self") && !download;
}

type NavigationHost = {
  rememberScroll(): void;
  commit(path: BackpackPath): void;
  push(path: BackpackPath): void;
  focus(): void;
  scroll(position: ScrollPosition): void;
};

// No asynchronous route work: commit the bundled view before projecting it into
// the address bar. Back/forward uses the same commit without adding an entry.
export function createBackpackNavigation(initialPath: BackpackPath, host: NavigationHost) {
  let currentPath = initialPath;
  return {
    navigate(path: BackpackPath) {
      if (path !== currentPath) {
        host.rememberScroll();
        host.commit(path);
        currentPath = path;
        host.push(path);
      }
      host.focus();
      host.scroll({ x: 0, y: 0 });
    },
    restore(path: BackpackPath, position: ScrollPosition) {
      host.commit(path);
      currentPath = path;
      host.focus();
      host.scroll(position);
    },
  };
}
