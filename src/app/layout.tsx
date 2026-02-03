import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ath.camera";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ATH Creative Studio",
  description:
    "Strategic video content for Web3 projects. 500+ videos produced, 5 years in crypto, trusted by the Solana ecosystem.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ATH",
    description: "We Help Web3 Projects Convert Attention Into Revenue in 32 ways.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: "/logo.png",
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
    images: ["/logo.png"],
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
