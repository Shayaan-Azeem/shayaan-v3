import { Bookmark, BookOpen, Calendar, Code, Heart } from "lucide-react";
import type { ComponentType } from "react";

/** Icons shown instead of the nav labels on narrow screens, keyed by nav href. */
const NAV_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  "/projects": Code,
  "/fieldnotes": BookOpen,
  "/philosophy": Heart,
  "/events": Calendar,
  "/favourites": Bookmark,
};

export default function NavIcon({ href }: { href: string }) {
  const Icon = NAV_ICONS[href];
  if (!Icon) return null;

  return <Icon size={18} />;
}
