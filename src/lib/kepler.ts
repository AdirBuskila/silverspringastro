/**
 * Two-body orbit math for the Kenlevin orbit views.
 *
 * All positions are heliocentric, J2000 ecliptic, in au. Angles in the element
 * objects are degrees; everything internal is radians.
 */
import { JUPITER_MEAN_ELEMENTS, KENLEVIN_ELEMENTS } from '@/data/kenlevin';

const DEG = Math.PI / 180;
const J2000 = 2451545.0;
const DAYS_PER_CENTURY = 36525;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Solves Kepler's equation M = E - e sin E for the eccentric anomaly E (radians). */
export function solveKepler(M: number, e: number): number {
  const m = ((M % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // wrap to [-pi, pi)
  let E = e < 0.8 ? m : Math.PI * Math.sign(m || 1);
  for (let k = 0; k < 30; k++) {
    const dE = (E - e * Math.sin(E) - m) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

/** Position from classical elements (a au, angles in radians). */
function positionFromElements(a: number, e: number, i: number, om: number, w: number, M: number): Vec3 {
  const E = solveKepler(M, e);
  // Position in the orbital plane, x toward perihelion.
  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = Math.cos(w), sw = Math.sin(w);
  const cO = Math.cos(om), sO = Math.sin(om);
  const ci = Math.cos(i), si = Math.sin(i);

  return {
    x: (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp,
    y: (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp,
    z: sw * si * xp + cw * si * yp,
  };
}

/** Kenlevin's heliocentric position at a Julian Date, propagated from the JPL osculating elements. */
export function kenlevinPosition(jd: number): Vec3 {
  const k = KENLEVIN_ELEMENTS;
  const M = (k.ma + k.n * (jd - k.epoch)) * DEG;
  return positionFromElements(k.a, k.e, k.i * DEG, k.om * DEG, k.w * DEG, M);
}

/** Jupiter's heliocentric position at a Julian Date from JPL's approximate mean elements. */
export function jupiterPosition(jd: number): Vec3 {
  const T = (jd - J2000) / DAYS_PER_CENTURY;
  const el = JUPITER_MEAN_ELEMENTS;
  const at = (v: readonly [number, number]) => v[0] + v[1] * T;
  const a = at(el.a);
  const e = at(el.e);
  const i = at(el.i) * DEG;
  const L = at(el.L) * DEG;
  const wBar = at(el.wBar) * DEG;
  const om = at(el.om) * DEG;
  return positionFromElements(a, e, i, om, wBar - om, L - wBar);
}

/** Jupiter's sidereal period in days, from the mean-longitude rate. */
export const JUPITER_PERIOD_DAYS = (360 / JUPITER_MEAN_ELEMENTS.L[1]) * DAYS_PER_CENTURY;

export interface CorotatingSample {
  jd: number;
  /** Kenlevin in the frame co-rotating with Jupiter (Jupiter on the +x axis), projected on the ecliptic. */
  x: number;
  y: number;
  /** Jupiter's distance from the Sun at this moment (it sits at (jupiterR, 0)). */
  jupiterR: number;
}

/**
 * Samples Kenlevin's path in a frame that rotates with Jupiter: at each step both bodies
 * are placed on their orbits, then rotated by minus Jupiter's heliocentric longitude.
 */
export function corotatingPath(startJd: number, days: number, stepDays: number): CorotatingSample[] {
  const out: CorotatingSample[] = [];
  for (let t = 0; t <= days; t += stepDays) {
    const jd = startJd + t;
    const j = jupiterPosition(jd);
    const k = kenlevinPosition(jd);
    const lambda = Math.atan2(j.y, j.x);
    const c = Math.cos(lambda), s = Math.sin(lambda);
    out.push({
      jd,
      x: k.x * c + k.y * s,
      y: -k.x * s + k.y * c,
      jupiterR: Math.hypot(j.x, j.y),
    });
  }
  return out;
}

/** Converts a Julian Date to a JS Date (UTC). */
export function jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

/** Converts a JS Date to a Julian Date. */
export function dateToJd(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}
