import imageManifest from '@/lib/site-image-manifest.json'

type SiteImageManifest = Record<string, string>

const manifest = imageManifest as SiteImageManifest

const LOCAL_IMAGE_EXTENSION = /\.(png|jpe?g)$/i

function convertLocalPathToWebp(pathname: string): string {
  if (LOCAL_IMAGE_EXTENSION.test(pathname)) {
    return pathname.replace(LOCAL_IMAGE_EXTENSION, '.webp')
  }

  return pathname
}

function buildBlobCandidateUrl(pathname: string): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_IMAGES_BLOB_BASE_URL
  if (!baseUrl) {
    return null
  }

  const withoutLeadingSlash = pathname.replace(/^\//, '')
  const webpPath = convertLocalPathToWebp(withoutLeadingSlash)
  const encodedPath = webpPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${baseUrl.replace(/\/$/, '')}/site-images/${encodedPath}`
}

export function resolveSiteImage(src?: string | null): string {
  if (!src) {
    return ''
  }

  if (!src.startsWith('/')) {
    return src
  }

  const directMatch = manifest[src]
  if (directMatch) {
    return directMatch
  }

  const webpKey = convertLocalPathToWebp(src)
  const webpMatch = manifest[webpKey]
  if (webpMatch) {
    return webpMatch
  }

  const blobCandidate = buildBlobCandidateUrl(src)
  if (blobCandidate) {
    return blobCandidate
  }

  return src
}
