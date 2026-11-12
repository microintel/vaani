# Vaani – Sign Language Detector

One codebase, two targets. Everything in `src/` is plain static web code and is shared.

```
src/            web app (index.html, css/, js/)  ← deploy this folder as-is for the web
electron/       desktop shell (main.js, preload.js)
scripts/        copy-mediapipe.js (offline MediaPipe copy)
```

## Setup
    npm install        # also copies MediaPipe into src/vendor for offline use

## Web
    npm run web        # http://localhost:5173  (camera needs localhost or https)
Deploy by uploading the contents of `src/` to any static host (Netlify, GitHub Pages, …).

## Desktop (Electron)
    npm start          # run the desktop app
    npm run dist       # build an installer into dist/

PWA: the web build is installable (manifest + service worker, offline after first load). Icons live in `src/icons`.

MediaPipe loads from `src/vendor/mediapipe` first and falls back to the CDN, so the web build works even without `npm install`.
