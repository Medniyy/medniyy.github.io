import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://ath.camera";
const ogImageUrl = "https://ath.camera/ath-logo-og.png?v=8";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ATH Creative Studio",
  description:
    "Strategic video content for Web3 projects. 500+ videos produced, 5 years in crypto, trusted by the Solana ecosystem.",
  icons: {
    icon: [{ url: "/favicon.ico?v=2", type: "image/x-icon" }, { url: "/ath-logo-32.png?v=2", type: "image/png", sizes: "32x32" }],
    apple: "/ath-logo-180.png?v=2",
  },
  openGraph: {
    title: "ATH Creative Studio",
    description: "We Help Web3 Projects Convert Attention Into Revenue in 32 ways.",
    type: "website",
    url: "https://ath.camera/",
    images: [
      {
        url: ogImageUrl,
        width: 600,
        height: 600,
        alt: "ATH Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ATH Creative Studio",
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
