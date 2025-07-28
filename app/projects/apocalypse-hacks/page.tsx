import ClientHome from '@/components/client-home'
import { getAllFieldnotes, getPhilosophy, getContentWorthConsuming, getAbout } from '@/lib/content'

export default async function ApocalypseHacksPage() {
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
      initialSection="apocalypse-hacks"
    />
  )
}

export function generateMetadata() {
  return {
    title: 'Apocalypse Hacks - Canada\'s Largest High School Hackathon',
    description: 'A 36-hour hackathon bringing together 150+ high schoolers to build amazing projects in Toronto.',
    keywords: ['Hackathon', 'Community', 'High School', 'Toronto', 'Hack Club'],
  }
}
