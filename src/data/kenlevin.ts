/**
 * Orbital data for asteroid (99862) Kenlevin, hardcoded so the site never calls an API at runtime.
 *
 * Source: NASA/JPL Small-Body Database (SBDB) API
 *   https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=99862&phys-par=1&discovery=1&full-prec=1
 * Retrieved: 2026-09-24
 * Orbit solution: JPL #39 (solution date 2026-08-20), 490 observations, 1997-01-09 to 2024-06-12.
 * Osculating elements at epoch JD 2461200.5 TDB (2026-Jun-18.0), heliocentric ecliptic J2000.
 */
export const KENLEVIN_ELEMENTS = {
  epoch: 2461200.5,
  e: 0.2605317317610352,
  a: 3.948021589891022, // au
  q: 2.919436688046758, // au
  Q: 4.976606491735285, // au (aphelion)
  i: 10.09174931600859, // deg
  om: 120.5258071575122, // deg, longitude of ascending node
  w: 262.0609245990832, // deg, argument of perihelion
  ma: 336.5141436665816, // deg, mean anomaly at epoch
  tp: 2461387.426814246014, // JD TDB, time of perihelion
  period: 2865.284202254604, // days
  n: 0.1256419868286459, // deg/day
} as const;

/** Other SBDB fields shown on the page, copied verbatim from the same API response. */
export const KENLEVIN_INFO = {
  fullName: '99862 Kenlevin (2002 OD25)',
  designation: '2002 OD25',
  orbitClass: 'Outer Main-belt Asteroid',
  discovery: {
    date: '2002-07-23',
    text: 'Discovered 2002 July 23 by S. F. Hoenig on plates taken at Palomar.',
    who: 'S. F. Hoenig',
    location: 'Palomar',
  },
  citation:
    'Ken Levin (b. 1953) is a physicist who works in the field of infrared optics and sensors for application in medicine, aerospace and astronomy. Levin is an avid amateur astronomer and operates two private observatories.',
  diameterKm: 7.336, // NEOWISE (Grav et al. 2012, Hilda population)
  absoluteMagnitude: 14.61,
  albedo: 0.052,
  // LCDB; JPL notes it is "based on less than full coverage, so that the period may be wrong by 30 percent or so".
  rotationPeriodHours: 94.2792,
  neo: false,
  pha: false,
  earthMoidAu: 1.94, // minimum distance between Kenlevin's orbit and Earth's orbit
  jupiterMoidAu: 0.895, // same, for Jupiter's orbit
  observationsUsed: 490,
  firstObs: '1997-01-09',
  lastObs: '2024-06-12',
  orbitSolution: 'JPL 39',
  retrieved: '2026-09-24',
  sbdbUrl: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=99862',
  spaceReferenceUrl: 'https://www.spacereference.org/asteroid/99862-kenlevin-2002-od25',
} as const;

/**
 * Jupiter's mean orbital elements and their rates per Julian century, valid 1800 AD to 2050 AD.
 * Source: JPL Solar System Dynamics, "Approximate Positions of the Planets", Table 1
 *   (E. M. Standish), https://ssd.jpl.nasa.gov/planets/approx_pos.html
 * Retrieved: 2026-09-24. Reference frame: J2000 ecliptic and equinox.
 */
export const JUPITER_MEAN_ELEMENTS = {
  a: [5.202887, -0.00011607], // au, au/cy
  e: [0.04838624, -0.00013253],
  i: [1.30439695, -0.00183714], // deg, deg/cy
  L: [34.39644051, 3034.74612775], // mean longitude
  wBar: [14.72847983, 0.21252668], // longitude of perihelion
  om: [100.47390909, 0.20469106], // longitude of ascending node
} as const;
