// public/electron.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

require('@electron/remote/main').initialize();

let mainWindow;

async function createWindow() {
  // Dynamically import electron-is-dev
  const isDev = (await import('electron-is-dev')).default;

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  require('@electron/remote/main').enable(mainWindow.webContents);

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .catch(err => console.log('Error loading React DevTools: ', err));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  app.relaunch();
  app.exit();
});

ipcMain.on('quit-app', () => {
  app.quit();
});