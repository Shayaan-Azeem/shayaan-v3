import ClientHome from '@/components/client-home'
import { getAllFieldnotes, getPhilosophy, getContentWorthConsuming, getAbout } from '@/lib/content'

export default async function TensorForestPage() {
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
      initialSection="tensorforest"
    />
  )
}

export function generateMetadata() {
  return {
    title: 'TensorForest - Wildfire Prevention Drones',
    description: 'Autonomous drone system for wildfire prediction and prevention using AI, remote sensing, and machine learning.',
    keywords: ['AI', 'Drones', 'Environmental Tech', 'Machine Learning', 'Wildfire Prevention'],
  }
}
