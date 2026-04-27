import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const headlineFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Avocat-Link",
  description:
    "Plateforme de consultations juridiques securisee pour connecter clients et avocats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${headlineFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
