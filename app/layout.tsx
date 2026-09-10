import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
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
  description: "Personal website of Shayaan Azeem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
