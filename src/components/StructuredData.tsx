/**
 * Structured Data (JSON-LD) Component
 * 
 * Provides rich snippets for Google search results.
 * This helps Google understand the content and display it better in search results.
 */

import { seoDefaults, siteInfo } from '@/data/site';

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoDefaults.siteName,
    url: seoDefaults.siteUrl,
    description: seoDefaults.description,
    author: {
      '@type': 'Person',
      name: siteInfo.owner.name,
      email: siteInfo.owner.email,
      description: siteInfo.owner.bio,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoDefaults.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function PersonStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteInfo.owner.name,
    email: siteInfo.owner.email,
    description: siteInfo.owner.bio,
    jobTitle: 'Physicist & Amateur Astronomer',
    url: seoDefaults.siteUrl,
    sameAs: [
      // Add Ken's social media profiles here if he has any
    ],
    knowsAbout: [
      'Astrophotography',
      'CCD Imaging',
      'Astronomy',
      'Infrared Optics',
      'Deep Sky Objects',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoDefaults.siteName,
    url: seoDefaults.siteUrl,
    logo: `${seoDefaults.siteUrl}/favicon/android-chrome-512x512.png`,
    description: seoDefaults.description,
    founder: {
      '@type': 'Person',
      name: siteInfo.owner.name,
    },
    foundingLocation: {
      '@type': 'Place',
      name: siteInfo.locations.original,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function ImageGalleryStructuredData({ 
  name, 
  description, 
  images 
}: { 
  name: string; 
  description: string; 
  images: { url: string; name: string }[];
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    description,
    author: {
      '@type': 'Person',
      name: siteInfo.owner.name,
    },
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url.startsWith('http') ? img.url : `${seoDefaults.siteUrl}${img.url}`,
      name: img.name,
      author: {
        '@type': 'Person',
        name: siteInfo.owner.name,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

