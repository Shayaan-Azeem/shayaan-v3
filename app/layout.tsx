import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "Shayaan Azeem",
  description: "Personal website of Shayaan Azeem",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' }
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false} 
          disableTransitionOnChange
          themes={['light', 'dark', 'reading', 'matcha']}
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
