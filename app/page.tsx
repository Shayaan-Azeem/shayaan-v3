import type React from "react"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { getAllFieldnotes, getPhilosophy, getAbout, type ContentItem } from "@/lib/content"
import ClientHome from "@/components/client-home"

export default function Home() {
  // Get content data (server-side)
  const allFieldnotes = getAllFieldnotes()
  const philosophy = getPhilosophy()
  const about = getAbout()

  return (
    <ClientHome
      fieldnotes={allFieldnotes}
      philosophy={philosophy}
      about={about}
    />
  )
}
