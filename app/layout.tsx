import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import AsciiFooter from "./components/AsciiFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geist = Geist({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Shayaan Azeem",
  description: "Shayaan Azeem is a software engineer studying Math and Philosophy at the University of Waterloo. Explore his projects, writing, and communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <AsciiFooter />
      </body>
    </html>
  );
}
