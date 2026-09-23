/**
 * Asteroid discoveries and confirmations, from the original site's astrometry page.
 * arc = observed arc / number of observations at the time (e.g. "4-opp/36" = 4 oppositions, 36 observations;
 * "1V/6" = one-night arc, 6 observations; "0/3" = not yet designated).
 */

export interface AsteroidDiscovery {
  date: string;
  obs: 'H85' | 'H08' | 'G53';
  object: string;
  observer: string;
  measurer: string;
  arc: string;
  mag: number;
  url?: string;
}

export const asteroidDiscoveries: AsteroidDiscovery[] = [
  { date: '2005-10-03', obs: 'H85', object: '2005 TT15 (242693)', observer: 'K. Levin', measurer: 'N. Teamo', arc: '6-opp/87', mag: 19.6, url: 'http://astrosurf.com/MPWeb/2005/K05T15T/K05T15T.htm' },
  { date: '2005-11-06', obs: 'H85', object: '2005 VL2', observer: 'K. Levin', measurer: 'J. C. Pelle', arc: '3-opp/72', mag: 19.1, url: 'http://astrosurf.com/MPWeb/2005/K05V02L/K05V02L.htm' },
  { date: '2006-01-30', obs: 'H08', object: '2006 BN212', observer: 'J. R. Gabany', measurer: 'K. Levin', arc: '4-opp/36', mag: 20.4, url: 'http://astrosurf.com/MPWeb/2006/K06BL2N/K06BL2N.htm' },
  { date: '2006-03-20', obs: 'H85', object: '2006 FD', observer: 'K. Levin', measurer: 'J. C. Pelle', arc: '93d/26', mag: 19.6, url: 'http://astrosurf.com/MPWeb/2006/K06F00D/K06F00D.htm' },
  { date: '2007-11-08', obs: 'H08', object: '2007 VW125', observer: 'K. Levin', measurer: 'J. C. Pelle', arc: '21d/8', mag: 21.6 },
  { date: '2008-12-07', obs: 'H08', object: '2008 XW6', observer: 'K. Levin', measurer: 'N. Teamo', arc: '45d/11', mag: 20.0 },
  { date: '2009-01-15', obs: 'H08', object: '2009 AT16', observer: 'K. Levin', measurer: 'N. Teamo', arc: '3V/4', mag: 21.2 },
  { date: '2009-01-19', obs: 'H08', object: '2009 BT9', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2V/5', mag: 21.4 },
  { date: '2009-01-19', obs: 'H08', object: '2009 BU9', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2V/4', mag: 21.8 },
  { date: '2009-01-19', obs: 'H08', object: '2009 BV9', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2V/4', mag: 21.9 },
  { date: '2009-10-25', obs: 'H08', object: '2009 UY91', observer: 'K. Levin', measurer: 'N. Teamo', arc: '4-opp/27', mag: 20.3 },
  { date: '2009-10-25', obs: 'H08', object: '2009 UP19', observer: 'K. Levin', measurer: 'N. Teamo', arc: '4-opp/50', mag: 19.7 },
  { date: '2009-10-25', obs: 'H08', object: '2009 UD20', observer: 'K. Levin', measurer: 'N. Teamo', arc: '3-opp/61', mag: 20.0 },
  { date: '2009-11-16', obs: 'H08', object: '2009 WU', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2-opp/35', mag: 20.0 },
  { date: '2010-11-30', obs: 'G53', object: '2010 W73V', observer: 'K. Levin', measurer: 'N. Teamo', arc: '13d/6', mag: 21.3 },
  { date: '2010-11-30', obs: 'G53', object: '2010 W73U', observer: 'K. Levin', measurer: 'N. Teamo', arc: '8d/8', mag: 21.8 },
  { date: '2010-11-30', obs: 'G53', object: '2010 X82U', observer: 'K. Levin', measurer: 'N. Teamo', arc: '3-opp/34', mag: 21.1 },
  { date: '2010-12-02', obs: 'G53', object: '2010 X82P', observer: 'K. Levin', measurer: 'N. Teamo', arc: '11d/8', mag: 21.7 },
  { date: '2010-12-02', obs: 'G53', object: '2010 X82Q', observer: 'K. Levin', measurer: 'N. Teamo', arc: '11d/8', mag: 21.9 },
  { date: '2010-12-02', obs: 'G53', object: 'KT0X28', observer: 'K. Levin', measurer: 'N. Teamo', arc: '0/3', mag: 22.0 },
  { date: '2010-12-02', obs: 'G53', object: 'KT0X29', observer: 'K. Levin', measurer: 'N. Teamo', arc: '0/2', mag: 22.0 },
  { date: '2010-12-08', obs: 'G53', object: '2010 X82X', observer: 'K. Levin', measurer: 'N. Teamo', arc: '5d/6', mag: 20.7 },
  { date: '2010-12-08', obs: 'G53', object: '2010 X82W', observer: 'K. Levin', measurer: 'N. Teamo', arc: '5d/6', mag: 21.2 },
  { date: '2010-12-13', obs: 'G53', object: 'KT0XD3', observer: 'K. Levin', measurer: 'N. Teamo', arc: '0/3', mag: 21.8 },
  { date: '2010-12-13', obs: 'G53', object: 'KT0XD4', observer: 'K. Levin', measurer: 'N. Teamo', arc: '0/3', mag: 21.9 },
  { date: '2010-12-29', obs: 'H85', object: '2011 AC2', observer: 'K. Levin', measurer: 'N. Teamo', arc: '46d/28', mag: 19.8 },
  { date: '2011-01-17', obs: 'G53', object: '2011 BH2', observer: 'K. Levin', measurer: 'N. Teamo', arc: '4-opp/36', mag: 20.6 },
  { date: '2011-01-17', obs: 'G53', object: '2011 BQ11', observer: 'K. Levin', measurer: 'N. Teamo', arc: '13d/15', mag: 19.9 },
  { date: '2011-01-21', obs: 'G53', object: '2011 BA11', observer: 'K. Levin', measurer: 'N. Teamo', arc: '4d/9', mag: 20.3 },
  { date: '2011-01-23', obs: 'G53', object: '2011 BD19', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2V/6', mag: 19.9 },
  { date: '2011-01-23', obs: 'G53', object: '2011 BC12', observer: 'K. Levin', measurer: 'N. Teamo', arc: '2V/6', mag: 21.6 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BQ15', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/6', mag: 20.9 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BR11', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1d/5', mag: 21.6 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BA13', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/4', mag: 21.4 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BA16', observer: 'K. Levin', measurer: 'N. Teamo', arc: '6d/10', mag: 20.5 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BB13', observer: 'K. Levin', measurer: 'N. Teamo', arc: '6d/10', mag: 21.0 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BB16', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/6', mag: 21.6 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BT18', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/6', mag: 21.4 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BU18', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/6', mag: 21.8 },
  { date: '2011-01-24', obs: 'G53', object: '2011 BV18', observer: 'K. Levin', measurer: 'N. Teamo', arc: '6d/10', mag: 21.9 },
  { date: '2011-02-06', obs: 'G53', object: '2011 CA69', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/5', mag: 20.6 },
  { date: '2011-02-06', obs: 'G53', object: '2011 CB69', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/5', mag: 21.6 },
  { date: '2011-02-06', obs: 'G53', object: '2011 CC69', observer: 'K. Levin', measurer: 'N. Teamo', arc: '1V/5', mag: 21.2 },
];
