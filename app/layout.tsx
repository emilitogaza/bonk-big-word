import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bonk Big Word",
  description: "Why say lot word when few word do trick?",
  openGraph: {
    title: "Bonk Big Word",
    description: "Why say lot word when few word do trick?",
    type: "website",
    locale: "en_US",
    siteName: "Bonk Big Word",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bonk Big Word",
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
