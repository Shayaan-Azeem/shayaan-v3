import ClientHome from "@/components/client-home"
import { notFound } from "next/navigation"
import { getContentItem, getAllFieldnotes, getPhilosophy, getContentWorthConsuming, getAbout } from "@/lib/content"

interface FieldnotePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const fieldnotes = getAllFieldnotes()
  
  return fieldnotes.map((item) => ({
    slug: item.slug,
  }))
}

export async function generateMetadata({ params }: FieldnotePageProps) {
  const { slug } = await params
  const item = getContentItem('fieldnotes', slug)
  
  if (!item) {
    return {
      title: 'Fieldnote Not Found',
    }
  }

  return {
    title: `${item.title} - Shayaan Azeem`,
    description: item.summary,
  }
}

export default async function FieldnotePage({ params }: FieldnotePageProps) {
  const { slug } = await params
  const item = getContentItem('fieldnotes', slug)

  if (!item) {
    notFound()
  }

  const fieldnotes = getAllFieldnotes()
  const philosophy = getPhilosophy()
  const contentWorthConsuming = getContentWorthConsuming()
  const about = getAbout()

  return (
    <ClientHome
      fieldnotes={fieldnotes}
      philosophy={philosophy}
      contentWorthConsuming={contentWorthConsuming}
      about={about}
      initialSection="fieldnotes"
      initialFieldnote={slug}
    />
  )
}