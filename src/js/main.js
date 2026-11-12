// App entry: wires camera → tracker → classifier → stabilizer → UI.

import './pwa.js';
import { SIGNS } from './signs.js';
import { classifyHands } from './twoHand.js';
import { Stabilizer } from './stabilizer.js';
import { Camera } from './camera.js';
import { HandTracker } from './tracker.js';
import { Renderer } from './renderer.js';
import { TextBuffer } from './textBuffer.js';
import { toAspect } from './geometry.js';
import { fingerStates } from './classifier.js';
import * as ui from './ui.js';

const DEBUG = new URLSearchParams(location.search).has('debug');

const { video, canvas } = ui.els;

const camera = new Camera(video);
const renderer = new Renderer(canvas, video);
const stabilizer = new Stabilizer();
const text = new TextBuffer(ui.setText);

const tracker = new HandTracker(video, hands => {
  renderer.draw(hands);
  const aspect = video.videoWidth / video.videoHeight || 4 / 3;
  const { stable, progress, commit } = stabilizer.update(classifyHands(hands.map(h => toAspect(h, aspect))));
  if (DEBUG) ui.setStatus(hands.map(h => { const f = fingerStates(toAspect(h, aspect)); return ['idx','mid','rng','pnk','thumb'].map(k => f[k] ? k[0].toUpperCase() : '-').join(''); }).join(' | ') || 'no hand');
  ui.setDetected(stable);
  ui.setHold(progress);
  if (commit) text.append(SIGNS[stable].text);
});

async function start() {
  ui.els.startBtn.disabled = true;
  ui.setStatus('Requesting camera…');
  try {
    await camera.start();
    ui.hideOverlay();
    ui.setRunning(true);
    ui.setStatus('Loading hand model…');
    await tracker.start();
    ui.setStatus('Running');
  } catch (err) {
    camera.stop();
    ui.setRunning(false);
    ui.setStatus('Error: ' + err.message);
    ui.showOverlay('Could not start: ' + err.message);
  }
}

function stop() {
  tracker.stop();
  camera.stop();
  renderer.clear();
  stabilizer.reset();
  ui.setRunning(false);
  ui.setStatus('Idle');
  ui.setDetected(null);
  ui.setHold(0);
  ui.showOverlay('');
}

ui.buildLegend();
ui.initTheme();
text.onChange(text.value);

ui.els.startBtn.onclick = start;
ui.els.stopBtn.onclick = stop;
ui.els.spaceBtn.onclick = () => text.space();
ui.els.backBtn.onclick = () => text.backspace();
ui.els.clearBtn.onclick = () => text.clear();
ui.els.speakBtn.onclick = () => text.speak();
