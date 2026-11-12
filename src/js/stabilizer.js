// Smooths per-frame predictions (majority vote) and tracks how long a sign has been held.

import { CONFIG } from './config.js';

export class Stabilizer {
  constructor() {
    this.reset();
  }

  reset() {
    this.history = [];
    this.heldKey = null;
    this.heldSince = 0;
    this.committed = false;
  }

  /**
   * Feed one frame's raw prediction (key or null).
   * Returns { stable, progress (0-100), commit } where commit is true
   * exactly once when the held sign should be typed.
   */
  update(key) {
    const { historySize, voteRatio, holdMs } = CONFIG;
    const now = performance.now();

    this.history.push(key);
    if (this.history.length > historySize) this.history.shift();

    const counts = {};
    this.history.forEach(k => {
      const n = k || 'none';
      counts[n] = (counts[n] || 0) + 1;
    });
    const [topKey, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const stable = topCount >= Math.ceil(historySize * voteRatio) && topKey !== 'none' ? topKey : null;

    if (!(stable && stable === this.heldKey)) {
      this.heldKey = stable;
      this.heldSince = now;
      this.committed = false;
    }

    const held = stable ? now - this.heldSince : 0;
    const progress = stable ? Math.min(100, (held / holdMs) * 100) : 0;

    let commit = false;
    if (stable && held >= holdMs && !this.committed) {
      this.committed = true;
      commit = true;
    }

    return { stable, progress, commit };
  }
}
