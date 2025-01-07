
const BrowserWindow = require("electron").BrowserWindow
const path = require("node:path")

const initBrowserWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, "preload.cjs")
    }
  })

  win.loadFile("./dist/index.html")
  win.webContents.openDevTools
  win.webContents.send("message", "message-content");

  return win
}

module.exports = initBrowserWindow

