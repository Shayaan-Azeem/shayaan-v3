import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import AsciiFooter from "./components/AsciiFooter";
import "./globals.css";

const manrope = Manrope({
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
    <html lang="en" className={`${manrope.variable} ${geist.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
        <AsciiFooter />
      </body>
    </html>
  );
}
