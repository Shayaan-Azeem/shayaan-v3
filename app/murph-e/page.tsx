import type { Metadata } from "next";
import BackpackSite from "../components/BackpackSite";
import { BACKPACK_ROUTES } from "../lib/backpackNavigation";

export const metadata: Metadata = BACKPACK_ROUTES["/murph-e"];

export default function Page() {
  return <BackpackSite initialPath="/murph-e" />;
}
