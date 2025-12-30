/**
 * Silver Spring Observatory - Travel Photo Data
 * 
 * Family travel photos from various destinations.
 * 
 * NOTE: imagePath should point to full-resolution images
 *       thumbnailPath should point to thumbnail versions for gallery grid
 *       If only thumbnails exist, both will be the same until full-res is added
 */

import { TravelPhoto } from '@/lib/types';

export const travelPhotos: TravelPhoto[] = [
  // Israel & Middle East
  {
    id: 'travel-camel',
    title: 'Camel Ride',
    location: 'Israel',
    imagePath: '/images/travel/camel.jpg',
    thumbnailPath: '/images/travel/camel_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-jerusalem-2003',
    title: 'Ken in Jerusalem',
    location: 'Jerusalem, Israel',
    date: '2003',
    imagePath: '/images/travel/KenJerusalem_2003.jpg',
    thumbnailPath: '/images/travel/KenJerusalem_2003_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-dead-sea',
    title: 'Dead Sea',
    location: 'Dead Sea, Israel',
    imagePath: '/images/travel/KenDeadSea.jpg',
    thumbnailPath: '/images/travel/KenDeadSea_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-dead-sea-2',
    title: 'Dead Sea Vista',
    location: 'Dead Sea, Israel',
    imagePath: '/images/travel/KenDeadSea2.jpg',
    thumbnailPath: '/images/travel/KenDeadSea2_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-negev',
    title: 'Negev Desert',
    location: 'Negev Desert, Israel',
    imagePath: '/images/travel/NegevDesert.jpg',
    thumbnailPath: '/images/travel/NegevDesert_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-mitzpe',
    title: 'Ken & Miriam at Mitzpe',
    location: 'Mitzpe Ramon, Israel',
    imagePath: '/images/travel/Ken_Miriam_Mitzpe.jpg',
    thumbnailPath: '/images/travel/Ken_Miriam_Mitzpe_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-wise-2006',
    title: 'Wise Observatory',
    location: 'Mitzpe Ramon, Israel',
    date: '2006',
    imagePath: '/images/travel/Wise_2006.jpg',
    thumbnailPath: '/images/travel/Wise_2006_thumb.jpg',
    description: 'Visit to the Wise Observatory in the Negev Desert',
    album: 'Israel',
  },
  {
    id: 'travel-beth-shikma-2007',
    title: 'Beth Shikma Family',
    location: 'Beth Shikma, Israel',
    date: '2007',
    imagePath: '/images/travel/BethShikmaFamily2007.jpg',
    thumbnailPath: '/images/travel/BethShikmaFamily2007_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-ashkelon-2008',
    title: 'Ashkelon Bus',
    location: 'Ashkelon, Israel',
    date: '2008',
    imagePath: '/images/travel/AshkelonBus_2008.jpg',
    thumbnailPath: '/images/travel/AshkelonBus_2008_thumb.jpg',
    album: 'Israel',
  },
  {
    id: 'travel-israel-april-2008',
    title: 'Israel Trip',
    location: 'Israel',
    date: 'April 2008',
    imagePath: '/images/travel/Israel_April2008.jpg',
    thumbnailPath: '/images/travel/Israel_April2008_thumb.jpg',
    album: 'Israel',
  },

  // Caribbean & Travel
  {
    id: 'travel-puerto-rico',
    title: 'Puerto Rico Scene',
    location: 'Puerto Rico',
    imagePath: '/images/travel/PuertoRicoScene.jpg',
    thumbnailPath: '/images/travel/PuertoRicoScene_thumb.jpg',
    album: 'Caribbean',
  },
  {
    id: 'travel-bahamas-2007',
    title: 'Bahamas Vacation',
    location: 'Bahamas',
    date: '2007',
    imagePath: '/images/travel/Bahamas2007.jpg',
    thumbnailPath: '/images/travel/Bahamas2007.jpg',
    album: 'Caribbean',
  },

  // Winter & Skiing
  {
    id: 'travel-ski-vermont',
    title: 'Ski Vermont',
    location: 'Vermont',
    date: '2005',
    imagePath: '/images/travel/SkiVermont_2005.jpg',
    thumbnailPath: '/images/travel/SkiVermont_2005_thumb.jpg',
    album: 'Winter',
  },
  {
    id: 'travel-blizzard',
    title: 'Blizzard',
    location: 'Maryland',
    imagePath: '/images/travel/blizzard.jpg',
    thumbnailPath: '/images/travel/blizzard_thumb.jpg',
    album: 'Winter',
  },

  // Personal & Family History
  {
    id: 'travel-ken-window',
    title: 'Ken by Window',
    location: 'Home',
    imagePath: '/images/travel/KenWindow.jpg',
    thumbnailPath: '/images/travel/KenWindowthumb.jpg', // Note: no underscore in original thumb filename
    album: 'Family',
  },
  {
    id: 'travel-ken-miri-wash-1978',
    title: 'Ken & Miriam in Washington',
    location: 'Washington D.C.',
    date: '1978',
    imagePath: '/images/travel/Ken_Miri_Wash_1978.jpg',
    thumbnailPath: '/images/travel/Ken_Miri_Wash_1978_thumb.jpg',
    album: 'Family',
  },
  {
    id: 'travel-ken-miriam-cornell-1979',
    title: 'Ken & Miriam at Cornell',
    location: 'Cornell University',
    date: '1979',
    imagePath: '/images/travel/KenMiriam_Cornell_1979.jpg',
    thumbnailPath: '/images/travel/KenMiriam_Cornell_1979_thumb.jpg',
    album: 'Family',
  },
  {
    id: 'travel-ken-miriam-1980',
    title: 'Ken & Miriam',
    location: 'USA',
    date: '1980',
    imagePath: '/images/travel/Ken_Miriam_1980.jpg',
    thumbnailPath: '/images/travel/Ken_Miriam_1980_thumb.jpg',
    album: 'Family',
  },
  {
    id: 'travel-tamar-gabriella-2016',
    title: 'Tamar and Gabriella',
    location: 'Home',
    date: '2016',
    imagePath: '/images/travel/Tamar and Gabriella 2016.jpg',
    thumbnailPath: '/images/travel/Tamar and Gabriella 2016.jpg',
    album: 'Family',
  },
  {
    id: 'travel-family-2003',
    title: 'Family Photo',
    location: 'Home',
    date: '2003',
    imagePath: '/images/travel/family2003.jpg',
    thumbnailPath: '/images/travel/family2003.jpg',
    album: 'Family',
  },
  {
    id: 'travel-ken-2008',
    title: 'Ken',
    location: 'Home',
    date: '2008',
    imagePath: '/images/travel/Ken2008.jpg',
    thumbnailPath: '/images/travel/Ken2008_thumb.jpg',
    album: 'Family',
  },

  // School & Clubs
  {
    id: 'travel-astronomy-club',
    title: 'Astronomy Club',
    location: 'High School',
    imagePath: '/images/travel/AstronomyClub.jpg',
    thumbnailPath: '/images/travel/AstronomyClub_thumb.jpg',
    description: 'High school astronomy club photo',
    album: 'Education',
  },
  {
    id: 'travel-article-ken',
    title: 'Ken Featured in Article',
    location: 'Maryland',
    imagePath: '/images/travel/articleKen.jpg',
    thumbnailPath: '/images/travel/articleKen_thumb.jpg',
    description: 'Newspaper article featuring Ken Levin',
    album: 'Press',
  },
];

// Get all unique albums
export function getAlbums(): string[] {
  const albums = new Set(travelPhotos.map(p => p.album).filter(Boolean) as string[]);
  return Array.from(albums);
}

// Get photos by album
export function getPhotosByAlbum(album: string): TravelPhoto[] {
  return travelPhotos.filter(p => p.album === album);
}

// Get all photos
export function getAllTravelPhotos(): TravelPhoto[] {
  return travelPhotos;
}
