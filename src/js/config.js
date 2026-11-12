// Central place for every tunable value.

export const CONFIG = {
  // MediaPipe
  mediapipe: {
    local: './vendor/mediapipe/',  // filled by `npm install` (works offline, used by Electron)
    cdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/'
  },
  hands: {
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5
  },

  // Webcam
  video: { width: 640, height: 480, facingMode: 'user' },

  // Smoothing / hold-to-type
  historySize: 7,     // frames used for majority vote
  voteRatio: 0.6,     // share of frames that must agree
  holdMs: 900,        // time a sign must be held before it is typed (independent of frame rate)
  smoothing: 0.6,     // landmark smoothing, 1 = none (lower = steadier but slower)

  // Classifier thresholds (ratios are relative to hand size)
  thresholds: {
    fingerExtend: 1.45, // tip-to-wrist vs knuckle-to-wrist
    thumbReach: 0.7,    // thumb tip to index knuckle
    uRatio: 1.8,        // index/middle tip gap vs knuckle gap: below this => U, else V
    fPinch: 0.45,       // thumb-index pinch for F
    oPinch: 0.4,        // thumb-index pinch for O
    thumbUpRise: 0.3,   // thumb tip above index knuckle
    thumbUpWrist: 0.6   // thumb tip above wrist
  },

  // Two-hand thresholds (ratios are relative to average hand size)
  twoHand: {
    pinch: 0.5,      // per-hand thumb-index pinch for MORE
    touch: 0.6,      // tip-to-tip distance counted as touching
    heartDrop: 0.25, // thumb tips must sit this far below index tips for HEART
    palmTouch: 0.8,  // fingertip to palm centre for TIME OUT
    crossWrist: 2.0, // max wrist gap for crossed fists (LOVE)
    together: 0.7,   // palms pressed together (PLEASE)
    apart: 3.0       // min wrist gap for CELEBRATE
  },

  // Hand skeleton drawing
  connections: [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [5,9],[9,10],[10,11],[11,12],
    [9,13],[13,14],[14,15],[15,16],
    [13,17],[17,18],[18,19],[19,20],[0,17]
  ],
  colors: { line: 'rgba(255,255,255,0.85)', point: '#34d399' }
};
