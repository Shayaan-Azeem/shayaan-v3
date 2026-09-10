import type { ReactNode } from "react";

/**
 * 24x24 stroke icons shown instead of the nav labels on narrow screens.
 * Keyed by nav href.
 */
export const NAV_ICONS: Record<string, ReactNode> = {
  "/projects": (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  "/fieldnotes": (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5Z" />
      <path d="M8 3v18" />
      <path d="M11.5 8h4" />
      <path d="M11.5 12h4" />
    </>
  ),
  "/philosophy": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-1.5 4.5L9 15l1.5-4.5Z" />
    </>
  ),
  "/events": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </>
  ),
  "/favourites": (
    <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
  ),
};

export default function NavIcon({ href }: { href: string }) {
  const icon = NAV_ICONS[href];
  if (!icon) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon}
    </svg>
  );
}
