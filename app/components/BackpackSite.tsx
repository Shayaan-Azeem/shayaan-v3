"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Home from "../HomeView";
import Projects from "../projects/ProjectsView";
import Fieldnotes from "../fieldnotes/FieldnotesView";
import Philosophy from "../philosophy/PhilosophyView";
import Events from "../events/EventsView";
import Favourites from "../favourites/FavouritesView";
import Forus from "../forus/ForusView";
import { BACKPACK_ROUTES, createBackpackNavigation, getBackpackPath, type BackpackPath, type ScrollPosition } from "../lib/backpackNavigation";
import { BackpackNavigationContext } from "./BackpackLink";

// Eager imports are intentional: every route's UI and static content travels in
// the initial backpack. Images and video remain separate, visibility-loaded assets.
const VIEWS = {
  "/": Home,
  "/projects": Projects,
  "/fieldnotes": Fieldnotes,
  "/philosophy": Philosophy,
  "/events": Events,
  "/favourites": Favourites,
  "/forus": Forus,
} satisfies Record<BackpackPath, typeof Home>;

export default function BackpackSite({ initialPath }: { initialPath: BackpackPath }) {
  // The server route supplies the initial URL, so direct links also have complete
  // prerendered HTML. Subsequent navigation is owned by local state.
  const [path, setPath] = useState(initialPath);
  const entryKey = useRef<string | null>(null);
  const positions = useRef(new Map<string, ScrollPosition>());
  const navigation = useMemo(() => createBackpackNavigation(initialPath, {
    rememberScroll() {
      if (entryKey.current) positions.current.set(entryKey.current, { x: window.scrollX, y: window.scrollY });
    },
    commit(nextPath) {
      flushSync(() => setPath(nextPath));
    },
    push(nextPath) {
      const key = crypto.randomUUID();
      entryKey.current = key;
      // Next's documented History API integration preserves its own router state.
      window.history.pushState({ backpackKey: key, backpackFrom: getBackpackPath(window.location.pathname) }, "", nextPath);
    },
    focus() {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    },
    scroll(position) {
      window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
    },
  }), [initialPath]);

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const key = window.history.state?.backpackKey ?? crypto.randomUUID();
    entryKey.current = key;
    window.history.replaceState({ ...window.history.state, backpackKey: key }, "");

    const rememberScroll = () => {
      if (entryKey.current) positions.current.set(entryKey.current, { x: window.scrollX, y: window.scrollY });
    };
    const restore = () => {
      const nextPath = getBackpackPath(window.location.pathname);
      if (!nextPath) {
        window.location.reload();
        return;
      }
      const nextKey = window.history.state?.backpackKey ?? crypto.randomUUID();
      const position = positions.current.get(nextKey) ?? { x: 0, y: 0 };
      entryKey.current = nextKey;
      navigation.restore(nextPath, position);
      if (window.location.hash === "#main-content") document.getElementById("main-content")?.scrollIntoView();
    };
    window.addEventListener("scroll", rememberScroll, { passive: true });
    window.addEventListener("popstate", restore);
    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", rememberScroll);
      window.removeEventListener("popstate", restore);
    };
  }, [navigation]);

  useEffect(() => {
    const metadata = BACKPACK_ROUTES[path];
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
  }, [path]);

  const View = VIEWS[path];
  return (
    <BackpackNavigationContext value={navigation.navigate}>
      <View />
    </BackpackNavigationContext>
  );
}
