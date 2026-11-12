const { contextBridge } = require('electron');

// Minimal, safe bridge so the web code can tell it is running inside the desktop app.
contextBridge.exposeInMainWorld('desktop', { isElectron: true, platform: process.platform });
