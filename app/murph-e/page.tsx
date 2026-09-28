import type { Metadata } from "next";
import BackpackSite from "../components/BackpackSite";
import { BACKPACK_ROUTES } from "../lib/backpackNavigation";

const article = BACKPACK_ROUTES["/murph-e"];

export const metadata: Metadata = {
  ...article,
  metadataBase: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "shayaan-v3.vercel.app"}`),
  openGraph: { ...article, type: "article" },
  twitter: { ...article, card: "summary_large_image" },
};

export default function Page() {
  return <BackpackSite initialPath="/murph-e" />;
}
