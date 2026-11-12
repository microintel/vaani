// Copies the MediaPipe Hands runtime from node_modules into src/vendor so the app works offline.
const fs = require('fs');
const path = require('path');

const from = path.join(__dirname, '..', 'node_modules', '@mediapipe', 'hands');
const to = path.join(__dirname, '..', 'src', 'vendor', 'mediapipe');

try {
  fs.mkdirSync(to, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(from)) {
    if (/\.(js|wasm|data|binarypb|tflite)$/.test(f)) { fs.copyFileSync(path.join(from, f), path.join(to, f)); n++; }
  }
  console.log(`MediaPipe: copied ${n} files to src/vendor/mediapipe`);
} catch (e) {
  console.warn('MediaPipe copy skipped (the app will fall back to the CDN):', e.message);
}
