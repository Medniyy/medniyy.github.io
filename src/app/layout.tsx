import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://ath.camera";
const ogImageUrl = "https://ath.camera/ath-logo-og.png?v=2";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ATH",
  description:
    "Strategic video content for Web3 projects. 500+ videos produced, 5 years in crypto, trusted by the Solana ecosystem.",
  icons: [
    { rel: "icon", url: "/favicon.ico?v=2", type: "image/x-icon" },
    { rel: "shortcut icon", url: "/favicon.ico?v=2" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/ath-logo-180.png?v=2" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/ath-logo-32.png?v=2" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/ath-logo-16.png?v=2" },
  ],
  openGraph: {
    title: "ATH",
    description: "We Help Web3 Projects Convert Attention Into Revenue in 32 ways.",
    type: "website",
    url: "https://ath.camera/",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 1200,
        alt: "ATH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATH",
    description: "We Help Web3 Projects Convert Attention Into Revenue in 32 ways.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
