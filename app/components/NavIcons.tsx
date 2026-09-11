import { Bookmark, BookOpen, Calendar, Heart, SquareCode, type LucideIcon } from "lucide-react";

/** Icons shown instead of the nav labels on narrow screens, keyed by nav href. */
const NAV_ICONS: Record<string, LucideIcon> = {
  "/projects": SquareCode,
  "/fieldnotes": BookOpen,
  "/philosophy": Heart,
  "/events": Calendar,
  "/favourites": Bookmark,
};

const ACTIVE_DETAILS: Record<string, string> = {
  "/projects": "m10 9-3 3 3 3m4 0 3-3-3-3",
  "/fieldnotes": "M12 5v14",
  "/events": "M4 9h16",
};

export default function NavIcon({ href, active = false }: { href: string; active?: boolean }) {
  const Icon = NAV_ICONS[href];
  if (!Icon) return null;

  return (
    <Icon size={18} fill={active ? "currentColor" : "none"} aria-hidden="true">
      {/* Lucide renders children last, above the solid icon body. */}
      {active && ACTIVE_DETAILS[href] ? (
        <path d={ACTIVE_DETAILS[href]} fill="none" stroke="#fff" />
      ) : null}
    </Icon>
  );
}
