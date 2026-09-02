import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
