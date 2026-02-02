import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATH Creative Studio",
  description:
    "Strategic video content for Web3 projects. 500+ videos produced, 5 years in crypto, trusted by the Solana ecosystem.",
  openGraph: {
    title: "ATH Creative Studio",
    description: "We help Web3 projects build trust through media",
    type: "website",
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
