import ClientHome from '@/components/client-home'
import { getAllFieldnotes, getPhilosophy, getContentWorthConsuming, getAbout } from '@/lib/content'

export default async function InspirationsPage() {
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
      initialSection="inspirations"
    />
  )
}

export function generateMetadata() {
  return {
    title: 'Inspirations - Shayaan Azeem',
    description: 'Things that inspire me and content worth consuming.',
  }
}
