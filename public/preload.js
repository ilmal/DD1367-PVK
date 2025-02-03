// public/preload.js
const { contextBridge, ipcRenderer } = require('electron');
const { remote } = require('@electron/remote');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  },
  remote: {
    getCurrentWindow: () => remote.getCurrentWindow(),
    app: remote.app
  }
});