// Rule-based handshape classifier. Input: 21 MediaPipe landmarks. Output: a key of SIGNS, or null.

import { CONFIG } from './config.js';
import { dist } from './geometry.js';

const T = CONFIG.thresholds;

/** Finger-state analysis shared by single- and two-hand classification. */
export function fingerStates(lm) {
  // wrist -> middle knuckle, with a palm-width fallback so a tilted (foreshortened) hand doesn't shrink it
  const size = Math.max(dist(lm[0], lm[9]), dist(lm[5], lm[17]) * 1.25) || 1;

  const fingerUp = (tip, mcp) => dist(lm[tip], lm[0]) > dist(lm[mcp], lm[0]) * T.fingerExtend;
  const idx = fingerUp(8, 5);
  const mid = fingerUp(12, 9);
  const rng = fingerUp(16, 13);
  const pnk = fingerUp(20, 17);
  const thumb =
    dist(lm[4], lm[5]) / size > T.thumbReach &&
    dist(lm[4], lm[17]) > dist(lm[3], lm[17]);
  const count = [idx, mid, rng, pnk].filter(Boolean).length;

  return { size, idx, mid, rng, pnk, thumb, count };
}

export function classify(lm) {
  const { size, idx, mid, rng, pnk, thumb, count } = fingerStates(lm);

  const pinch = dist(lm[4], lm[8]) / size;       // thumb tip - index tip
  const idxMidGap = dist(lm[8], lm[12]) / (dist(lm[5], lm[9]) || 1); // tip gap relative to knuckle gap
  const thumbUp =
    thumb &&
    lm[4].y < lm[3].y &&
    lm[4].y < lm[5].y - size * T.thumbUpRise &&
    lm[4].y < lm[0].y - size * T.thumbUpWrist;

  if (count === 4 && thumb) return 'HELLO';
  if (count === 4 && !thumb) return 'B';
  if (!idx && mid && rng && pnk && pinch < T.fPinch) return 'F';
  if (idx && !mid && !rng && pnk && thumb) return 'ILY';
  if (idx && mid && rng && !pnk) return 'W';
  if (idx && mid && !rng && !pnk) return idxMidGap < T.uRatio ? 'U' : 'V';
  if (!idx && !mid && !rng && pnk) return thumb ? 'Y' : 'I';
  if (idx && !mid && !rng && !pnk) return thumb ? 'L' : 'D';
  if (count === 0) {
    if (thumbUp) return 'GOOD';
    if (pinch < T.oPinch && !thumb) return 'O';
    return 'A';
  }
  return null;
}
