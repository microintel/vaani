// Draws the hand skeleton on the overlay canvas.

import { CONFIG } from './config.js';

export class Renderer {
  constructor(canvas, video) {
    this.canvas = canvas;
    this.video = video;
    this.ctx = canvas.getContext('2d');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(hands) {
    const { canvas, video, ctx } = this;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!hands || !hands.length) return;

    const w = canvas.width, h = canvas.height;

    hands.forEach(lm => {
      ctx.lineWidth = 3;
      ctx.strokeStyle = CONFIG.colors.line;
      CONFIG.connections.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(lm[a].x * w, lm[a].y * h);
        ctx.lineTo(lm[b].x * w, lm[b].y * h);
        ctx.stroke();
      });

      ctx.fillStyle = CONFIG.colors.point;
      lm.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }
}
