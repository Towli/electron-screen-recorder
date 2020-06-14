const { app, BrowserWindow } = require("electron");

require("dotenv").config();

function createWindow() {
  const window = new BrowserWindow({
    width: parseInt(process.env.WINDOW_WIDTH),
    height: parseInt(process.env.WINDOW_HEIGHT),
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
  });

  window.loadFile("index.html");
}

app.whenReady().then(createWindow);
