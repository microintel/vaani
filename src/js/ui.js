// All DOM access lives here; other modules never touch the document directly.

import { SIGNS } from './signs.js';

const $ = id => document.getElementById(id);

export const els = {
  video: $('video'),
  canvas: $('canvas'),
  overlay: $('overlay'),
  startBtn: $('startBtn'),
  stopBtn: $('stopBtn'),
  spaceBtn: $('spaceBtn'),
  backBtn: $('backBtn'),
  clearBtn: $('clearBtn'),
  speakBtn: $('speakBtn'),
  themeBtn: $('themeBtn')
};

const status = $('status');
const big = $('big');
const name = $('name');
const hold = $('hold');
const out = $('out');
const legend = $('legend');

export function buildLegend() {
  Object.entries(SIGNS).forEach(([key, s]) => {
    const d = document.createElement('div');
    d.className = 'sign' + (s.two ? ' two' : '');
    d.id = 'lg-' + key;
    d.innerHTML = `<b>${s.big}</b>${s.hint}`;
    legend.appendChild(d);
  });
}

export function setStatus(msg) {
  status.textContent = msg;
}

export function showOverlay(msg) {
  els.overlay.textContent = msg;
  els.overlay.classList.remove('hidden');
}

export function hideOverlay() {
  els.overlay.classList.add('hidden');
}

export function setRunning(running) {
  document.body.classList.toggle('live', running);
  els.startBtn.disabled = running;
  els.stopBtn.disabled = !running;
}

export function setDetected(key) {
  document.querySelectorAll('.sign.on').forEach(e => e.classList.remove('on'));
  if (!key) {
    big.textContent = '–';
    name.textContent = '';
    return;
  }
  big.textContent = SIGNS[key].big;
  name.textContent = SIGNS[key].name;
  const lg = $('lg-' + key);
  if (lg) lg.classList.add('on');
}

export function setHold(percent) {
  hold.style.width = percent + '%';
}

export function setText(text) {
  out.textContent = text;
}

export function initTheme() {
  const root = document.documentElement;
  els.themeBtn.onclick = () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  };
}
