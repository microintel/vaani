// Webcam stream lifecycle.

import { CONFIG } from './config.js';

export class Camera {
  constructor(video) {
    this.video = video;
    this.stream = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: CONFIG.video, audio: false });
    this.video.srcObject = this.stream;
    await this.video.play();
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
  }
}
