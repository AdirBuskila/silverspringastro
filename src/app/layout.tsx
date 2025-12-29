import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WebsiteStructuredData, PersonStructuredData, OrganizationStructuredData } from "@/components/StructuredData";
import { seoDefaults } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoDefaults.siteUrl),
  title: {
    default: seoDefaults.title,
    template: `%s | ${seoDefaults.siteName}`,
  },
  description: seoDefaults.description,
  keywords: seoDefaults.keywords,
  authors: [{ name: seoDefaults.author }],
  creator: seoDefaults.author,
  publisher: seoDefaults.author,
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: 'any' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/favicon/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/favicon/android-chrome-512x512.png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  alternates: {
    canonical: seoDefaults.siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: seoDefaults.siteUrl,
    siteName: seoDefaults.siteName,
    title: seoDefaults.title,
    description: seoDefaults.description,
    images: [
      {
        url: seoDefaults.ogImage,
        width: 1200,
        height: 630,
        alt: 'Silver Spring Observatory - CCD Astro-Imaging by Ken Levin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoDefaults.title,
    description: seoDefaults.description,
    images: [seoDefaults.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after setting it up
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Structured Data for SEO */}
        <WebsiteStructuredData />
        <PersonStructuredData />
        <OrganizationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
