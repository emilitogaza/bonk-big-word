import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Big Word Bonk",
  description: "Why say lot word when few word do trick?",
  openGraph: {
    title: "Big Word Bonk",
    description: "Why say lot word when few word do trick?",
    type: "website",
    locale: "en_US",
    siteName: "Big Word Bonk",
  },
  twitter: {
    card: "summary_large_image",
    title: "Big Word Bonk",
    description: "Why say lot word when few word do trick?",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`$${bricolageGrotesque.variable} antialiased`}>{children}</body>
    </html>
  );
}
