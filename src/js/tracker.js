// MediaPipe Hands wrapper: runs the detection loop and reports landmarks per frame.

import { CONFIG } from './config.js';

const loadScript = src => new Promise((resolve, reject) => {
  const s = document.createElement('script');
  s.src = src;
  s.onload = resolve;
  s.onerror = () => reject(new Error('Could not load ' + src));
  document.head.appendChild(s);
});

/** Loads MediaPipe Hands (exposes window.Hands); returns the base URL its files came from. */
async function loadMediaPipe() {
  for (const base of [CONFIG.mediapipe.local, CONFIG.mediapipe.cdn]) {
    try {
      if (typeof window.Hands === 'undefined') await loadScript(base + 'hands.js');
      if (typeof window.Hands !== 'undefined') return base;
    } catch (e) { /* try next source */ }
  }
  throw new Error('MediaPipe failed to load (run "npm install" or check your internet connection).');
}

export class HandTracker {
  /**
   * @param {HTMLVideoElement} video
   * @param {(hands: Array<Array>) => void} onLandmarks  one landmark array per detected hand
   */
  constructor(video, onLandmarks) {
    this.video = video;
    this.onLandmarks = onLandmarks;
    this.hands = null;
    this.running = false;
    this.prev = [];
  }

  /** Drops ghost/duplicate hands, orders them left-to-right and smooths jitter. */
  _pick(res) {
    const lms = res.multiHandLandmarks || [];
    const meta = res.multiHandedness || [];
    const cand = lms
      .map((lm, i) => ({ lm, score: (meta[i] && meta[i].score) || 0 }))
      .sort((p, q) => q.score - p.score);

    // MediaPipe can give two real hands the same Left/Right label, so don't dedupe by label:
    // only drop a candidate that sits on top of a better one (same hand seen twice).
    const near = (p, q) => Math.hypot(p.x - q.x, p.y - q.y) < 0.02;
    const kept = [];
    cand.forEach(c => {
      if (!kept.some(k => near(k.lm[0], c.lm[0]) && near(k.lm[9], c.lm[9]))) kept.push(c);
    });
    kept.sort((p, q) => p.lm[0].x - q.lm[0].x);

    const k = CONFIG.smoothing;
    const used = new Set();
    const out = kept.slice(0, 2).map(({ lm }) => {
      // match to the closest hand from the previous frame (labels flip, positions don't)
      let bi = -1, bd = 0.2;
      this.prev.forEach((p, i) => {
        const d = Math.hypot(p[0].x - lm[0].x, p[0].y - lm[0].y);
        if (!used.has(i) && d < bd) { bd = d; bi = i; }
      });
      if (bi < 0) return lm;
      used.add(bi);
      const p = this.prev[bi];
      return lm.map((q, i) => ({
        x: p[i].x + (q.x - p[i].x) * k,
        y: p[i].y + (q.y - p[i].y) * k,
        z: p[i].z + (q.z - p[i].z) * k
      }));
    });
    this.prev = out;
    return out;
  }

  /** Resolves after the first frame has been processed. */
  async start() {
    const base = await loadMediaPipe();

    this.hands = new window.Hands({ locateFile: f => base + f });
    this.hands.setOptions(CONFIG.hands);
    this.hands.onResults(res => {
      this.onLandmarks(this._pick(res));
    });

    this.prev = [];
    this.running = true;
    return new Promise((resolve, reject) => {
      let first = true;
      const loop = async () => {
        if (!this.running) return;
        try {
          if (this.video.readyState >= 2) {
            await this.hands.send({ image: this.video });
            if (first) { first = false; resolve(); }
          }
        } catch (err) {
          this.running = false;
          reject(err);
          return;
        }
        requestAnimationFrame(loop);
      };
      loop();
    });
  }

  stop() {
    this.running = false;
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
  }
}
