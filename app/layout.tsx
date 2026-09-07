import type { Metadata } from "next";
import { Manrope, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const urdu = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: "600",
  variable: "--font-urdu",
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
    <html lang="en" className={`${manrope.variable} ${urdu.variable}`}>
      <body>{children}</body>
    </html>
  );
}
