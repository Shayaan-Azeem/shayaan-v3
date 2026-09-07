import type { Metadata } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={urdu.variable}>
      <body>{children}</body>
    </html>
  );
}
