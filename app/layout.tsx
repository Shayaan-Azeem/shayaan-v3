import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "Shayaan Azeem",
  description: "Personal website of Shayaan Azeem"
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
        </ThemeProvider>
      </body>
    </html>
  )
}
