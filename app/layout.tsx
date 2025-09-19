import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediaShifter - ブラウザで動画変換",
  description: "ブラウザ上で動画ファイルを様々な形式（MP4、WebM、GIF、音声形式など）に変換できる無料のWebアプリケーションです。",
  keywords: ["動画変換", "ブラウザ", "MP4", "WebM", "GIF", "音声変換", "オンライン", "無料"],
  authors: [{ name: "aratama" }],
  creator: "aratama",
  publisher: "aratama",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aratama.github.io"),
  alternates: {
    canonical: "/mediashifter/",
  },
  openGraph: {
    title: "MediaShifter - ブラウザで動画変換",
    description: "ブラウザ上で動画ファイルを様々な形式（MP4、WebM、GIF、音声形式など）に変換できる無料のWebアプリケーションです。",
    url: "https://aratama.github.io/mediashifter/",
    siteName: "MediaShifter",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/mediashifter/og-image.png",
        width: 1200,
        height: 630,
        alt: "MediaShifter - ブラウザで動画変換",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediaShifter - ブラウザで動画変換",
    description: "ブラウザ上で動画ファイルを様々な形式（MP4、WebM、GIF、音声形式など）に変換できる無料のWebアプリケーションです。",
    images: ["/mediashifter/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/mediashifter/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/mediashifter/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/mediashifter/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/mediashifter/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  manifest: "/mediashifter/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🦜</text></svg>"></link>
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/mediashifter/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
