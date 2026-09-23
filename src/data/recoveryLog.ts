/**
 * Faint-asteroid recovery survey at Silver Spring Observatory (H85), September 2005 - February 2006.
 * Images live in /images/asteroids/archive:
 *   <date>_ComboNa.jpg   stack aligned on the stars, target circled
 *   <date>_FixedNa.jpg   same, from a fixed (unguided) sequence
 *   <date>_MovingNa.jpg  stack aligned on the asteroid's motion, so the stars trail
 *   AirMass_<date>.jpg, Extinct_<date>.jpg, SkyBackGround_<date>.jpg  nightly sky-quality plots
 */

export interface RecoveryNight {
  // YYYYMMDD, as used in the file names
  date: string;
  frames: string[];
  plots?: boolean;
}

export const recoveryNights: RecoveryNight[] = [
  { date: '20050907', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20050908', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20050910', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20050913', frames: ['Moving0', 'Moving1'], plots: true },
  { date: '20050921', frames: ['Moving0', 'Moving1', 'Moving2'], plots: true },
  { date: '20050922', frames: ['Moving0', 'Moving1', 'Moving2'], plots: true },
  { date: '20050927', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20050928', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20050929', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4'], plots: true },
  { date: '20051001', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051002', frames: ['Combo0', 'Combo1', 'Combo2', 'Moving0', 'Moving1', 'Moving2', 'Moving3', 'Moving4'], plots: true },
  { date: '20051005', frames: ['Combo0', 'Combo1', 'Moving0', 'Moving1'], plots: true },
  { date: '20051006', frames: ['Moving0', 'Moving1'], plots: true },
  { date: '20051015', frames: ['Combo0', 'Combo1', 'Combo2', 'Moving0', 'Moving1', 'Moving2', 'Moving3'], plots: true },
  { date: '20051016', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4'], plots: true },
  { date: '20051019', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051026', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051029', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051030', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051031', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051103', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4'], plots: true },
  { date: '20051105', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4', 'Combo5'], plots: true },
  { date: '20051106', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3'], plots: true },
  { date: '20051107', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3'], plots: true },
  { date: '20051110', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051112', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3'], plots: true },
  { date: '20051117', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3'], plots: true },
  { date: '20051119', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051120', frames: ['Combo0', 'Combo1'], plots: true },
  { date: '20051122', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051124', frames: ['Combo0', 'Fixed1', 'Combo2'], plots: true },
  { date: '20051126', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051130', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051206', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051207', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051210', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051212', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051213', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051218', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051219', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4', 'Combo5', 'Combo6', 'Combo7'], plots: true },
  { date: '20051220', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20051221', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3'], plots: true },
  { date: '20051222', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Combo4'], plots: true },
  { date: '20051224', frames: ['Combo0', 'Combo1', 'Combo2', 'Combo3', 'Moving0'], plots: true },
  { date: '20051227', frames: ['Combo0', 'Combo1'], plots: true },
  { date: '20060119', frames: ['Combo0', 'Combo2'], plots: true },
  { date: '20060202', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20060204', frames: ['Combo0', 'Combo1', 'Combo2'], plots: true },
  { date: '20060220', frames: ['Combo0', 'Combo1'], plots: true },
];
