import { isPlainNavigation } from "../lib/backpackNavigation";
import type { MouseEvent } from "react";

export function jumpToFootnote(event: MouseEvent<HTMLAnchorElement>) {
  const link = event.currentTarget;
  if (!isPlainNavigation(event, link.target, link.hasAttribute("download"))) return;
  const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  // Preserve the backpack entry so Back returns to the page that opened the article.
  window.history.replaceState(window.history.state, "", link.hash);
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
