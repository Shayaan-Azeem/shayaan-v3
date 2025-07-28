import ClientHome from '@/components/client-home'
import { getAllFieldnotes, getPhilosophy, getContentWorthConsuming, getAbout } from '@/lib/content'

export default async function ContentPage() {
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
      initialSection="content"
    />
  )
}

export function generateMetadata() {
  return {
    title: 'Content - Shayaan Azeem',
    description: 'Content and resources I find valuable.',
  }
}
