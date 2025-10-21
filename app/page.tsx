import type React from "react"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { getPhilosophy, getContentWorthConsuming, getAbout } from "@/lib/content"
import { getAllSubstackFieldnotes, type SubstackArticle } from "@/lib/substack"
import ClientHome from "@/components/client-home"

export default async function Home() {
  // Get content data (server-side)
  const allFieldnotes = await getAllSubstackFieldnotes()
  const philosophy = getPhilosophy()
  const contentWorthConsuming = getContentWorthConsuming()
  const about = getAbout()

  return (
    <ClientHome
      fieldnotes={allFieldnotes}
      philosophy={philosophy}
      contentWorthConsuming={contentWorthConsuming}
      about={about}
    />
  )
}
