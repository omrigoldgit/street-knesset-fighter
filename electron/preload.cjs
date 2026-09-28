const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('skfDesktop', {
  quit: () => ipcRenderer.send('skf:quit'),
  toggleFullscreen: () => ipcRenderer.send('skf:fullscreen'),
});
