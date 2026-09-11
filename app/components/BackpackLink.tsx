"use client";

import { createContext, useContext, type ComponentProps } from "react";
import { getBackpackPath, isPlainNavigation, type BackpackPath } from "../lib/backpackNavigation";

export const BackpackNavigationContext = createContext<((path: BackpackPath) => void) | null>(null);

// Real anchors preserve open-in-new-tab, copying URLs, and pre-hydration links.
export default function BackpackLink({ href, onClick, ...props }: ComponentProps<"a"> & { href: string }) {
  const navigate = useContext(BackpackNavigationContext);
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (!navigate || !isPlainNavigation(event, event.currentTarget.target, event.currentTarget.hasAttribute("download"))) return;
        const url = new URL(event.currentTarget.href);
        const path = getBackpackPath(url.pathname);
        if (url.origin !== window.location.origin || !path || url.search || url.hash) return;
        event.preventDefault();
        navigate(path);
      }}
    />
  );
}
