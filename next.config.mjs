import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
