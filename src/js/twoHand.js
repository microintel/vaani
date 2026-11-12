// Two-hand sign recognition. Falls back to single-hand classification when no two-hand sign matches.

import { CONFIG } from './config.js';
import { dist } from './geometry.js';
import { fingerStates, classify } from './classifier.js';

const P = CONFIG.twoHand;

const palmCentre = lm => {
  const ids = [0, 5, 9, 13, 17];
  return {
    x: ids.reduce((s, i) => s + lm[i].x, 0) / ids.length,
    y: ids.reduce((s, i) => s + lm[i].y, 0) / ids.length
  };
};

const isFlat = f => f.count === 4;
const isPointing = f => f.idx && !f.mid && !f.rng && !f.pnk;

function classifyTwo(a, b) {
  const A = fingerStates(a);
  const B = fingerStates(b);
  const size = (A.size + B.size) / 2;
  const d = (p, q) => dist(p, q) / size;

  // PLEASE: open palms pressed together
  if (isFlat(A) && isFlat(B) && d(a[9], b[9]) < P.together && d(a[8], b[8]) < P.together) return 'PLEASE';

  // LOVE: two fists, wrists crossed
  if (
    A.count === 0 && B.count === 0 &&
    d(a[0], b[0]) < P.crossWrist &&
    (a[0].x - b[0].x) * (a[9].x - b[9].x) < 0
  ) return 'LOVE';

  // MORE: both hands pinched, fingertips touching
  if (d(a[4], a[8]) < P.pinch && d(b[4], b[8]) < P.pinch && d(a[8], b[8]) < P.touch) return 'MORE';

  // HEART: index tips touch on top, thumb tips touch below
  if (
    d(a[4], b[4]) < P.touch && d(a[8], b[8]) < P.touch &&
    (a[4].y + b[4].y) / 2 > (a[8].y + b[8].y) / 2 + P.heartDrop * size
  ) return 'HEART';

  // TIME OUT: one index fingertip on the other hand's flat palm
  if (isFlat(A) && isPointing(B) && dist(b[8], palmCentre(a)) / size < P.palmTouch) return 'TIMEOUT';
  if (isFlat(B) && isPointing(A) && dist(a[8], palmCentre(b)) / size < P.palmTouch) return 'TIMEOUT';

  // Same single-hand shape on both hands
  const ka = classify(a);
  const kb = classify(b);
  if (ka === 'V' && kb === 'V') return 'PEACE';
  if (ka === 'GOOD' && kb === 'GOOD') return 'GREAT';

  // CELEBRATE: both open hands held wide apart
  if (isFlat(A) && isFlat(B) && d(a[0], b[0]) > P.apart) return 'CELEBRATE';

  return null;
}

/** hands: array of 21-landmark arrays (0, 1 or 2). Returns a key of SIGNS, or null. */
export function classifyHands(hands) {
  if (!hands || !hands.length) return null;

  if (hands.length >= 2) {
    const two = classifyTwo(hands[0], hands[1]);
    if (two) return two;
  }

  let fallback = null;
  for (const lm of hands) {
    const k = classify(lm);
    if (k && k !== 'A') return k;
    if (k && !fallback) fallback = k;
  }
  return fallback;
}
