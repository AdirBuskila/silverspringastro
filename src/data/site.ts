/**
 * Site Information
 * 
 * Core information about Ken Levin and Silver Spring Observatory.
 * Extracted from the original website.
 */

export const siteInfo = {
  title: 'Silver Spring Observatory',
  subtitle: 'CCD Astro-Imaging',
  tagline: 'CCD Astro-Imaging',
  description: 'Astronomy portfolio featuring deep sky images captured from Silver Spring Observatory and remote observatories. Galaxies, nebulae, star clusters, and more.',
  
  owner: {
    name: 'Ken Levin',
    email: 'Klevin@aol.com',
    bio: 'Ken Levin (b. 1953) is a physicist who works in the field of infrared optics and sensors for application in medicine, aerospace and astronomy. Levin is an avid amateur astronomer and operates two private observatories.',
  },

  locations: {
    original: 'Silver Spring, Maryland',
    current: 'Concordia University, Irvine, CA',
    remote: 'Sierra Remote Observatories',
  },

  // Notable mentions and achievements
  achievements: [
    {
      title: 'Asteroid (99862) Kenlevin',
      description: 'Asteroid named for Ken Levin. Citation: (99862) "Kenlevin" = 2002 OD2',
    },
    {
      title: 'Washington Post Article',
      description: 'Featured in the Washington Post for amateur astronomy work.',
      url: '/publications/washington-post',
    },
  ],

  // Observatory codes explanation
  observatoryCodes: {
    H85: 'Silver Spring Observatory (MD)',
    BBO: 'Blackbird Observatory near Cloudcroft, New Mexico (now at SRO)',
    SRO: 'Sierra Remote Observatories',
    G53: 'Alder Springs Observatory',
  },

  // Taglines for the homepage
  taglines: [
    'All images taken from Silver Spring, Maryland or from Cloudcroft, New Mexico',
    'Now located at Concordia University, Irvine, CA',
    'Remote imaging at Sierra Remote Observatories',
  ],
};

export const seoDefaults = {
  siteName: 'Silver Spring Observatory',
  title: 'Silver Spring Observatory | CCD Astro-Imaging',
  description: 'Deep sky astrophotography by Ken Levin. Galaxies, nebulae, star clusters, supernovae and more captured from personal and remote observatories using CCD imaging.',
  keywords: [
    'astrophotography', 
    'astronomy', 
    'CCD imaging', 
    'galaxies', 
    'nebulae', 
    'deep sky', 
    'Silver Spring Observatory', 
    'Ken Levin',
    'telescope imaging',
    'deep sky objects',
    'star clusters',
    'supernovae',
    'amateur astronomy',
    'cassegrain telescope',
    'astronomical objects',
  ],
  author: 'Ken Levin',
  siteUrl: 'https://www.silverspringastro.com',
  twitterHandle: undefined, // Add if Ken has a Twitter/X account
  ogImage: '/images/hero/ken-telescope-desktop.jpg',
};

