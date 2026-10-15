/**
 * Silver Spring Observatory - Family Home Movies
 *
 * Home movies from the original site's Family page, converted from
 * .wmv/.avi to MP4 so they play in modern browsers. The two long videos
 * are split into parts to keep each file a reasonable download.
 */

export interface FamilyVideo {
  id: string;
  title: string;
  location?: string;
  date?: string;
  src: string;
  poster: string;
  duration: string;
}

const v = (id: string, title: string, duration: string, location?: string, date?: string): FamilyVideo => ({
  id,
  title,
  location,
  date,
  src: `/videos/family/${id}.mp4`,
  poster: `/videos/family/${id}.jpg`,
  duration,
});

export const familyVideos: FamilyVideo[] = [
  v('israel-flight', 'Tamar, Miriam, Carmit, Ken - Flight to Israel', '1:27', 'Israel'),
  v('jerusalem-2003', 'Jerusalem', '0:30', 'Jerusalem, Israel', '2003'),
  v('eilat', 'Eilat', '0:29', 'Eilat, Israel'),
  v('mitzpe-ramon-2006', 'Wise Observatory, Mitzpe Ramon', '1:01', 'Mitzpe Ramon, Israel', 'Aug 2006'),
  v('ramon-crater-2007', 'Ramon Crater', '0:49', 'Mitzpe Ramon, Israel', 'Aug 2007'),
  v('ashkelon-beach', 'Ashkelon Beach', '0:30', 'Ashkelon, Israel'),
  v('beth-shikma-farm-1', 'Farm, Part 1', '0:30', 'Beth Shikma, Israel'),
  v('beth-shikma-farm-2', 'Farm, Part 2', '0:30', 'Beth Shikma, Israel'),
  v('mall', 'Mall', '0:30', 'Israel'),
  v('puerto-rico-2003', 'Puerto Rico', '0:30', 'Puerto Rico', 'Jan 2003'),
  v('snow-the-dog', 'Snow (the dog)', '1:36'),
  v('vermont-ski-2005-part-1', 'Sugarbush Skiing, Part 1', '10:47', 'Sugarbush, VT', '2005'),
  v('vermont-ski-2005-part-2', 'Sugarbush Skiing, Part 2', '10:47', 'Sugarbush, VT', '2005'),
  v('new-hampshire-1997-clip', 'New Hampshire', '3:10', 'New Hampshire', '1997'),
  v('new-hampshire-1997-part-1', 'New Hampshire, Full Video Part 1', '9:38', 'New Hampshire', '1997'),
  v('new-hampshire-1997-part-2', 'New Hampshire, Full Video Part 2', '9:37', 'New Hampshire', '1997'),
];
