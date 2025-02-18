
import { BrowserWindow, screen } from 'electron'
import * as path from 'path'

const initBrowserWindow = (htmlDistPath: string) => {
  const primaryDisplay = screen.getPrimaryDisplay()
  
  const { width, height } = primaryDisplay.workAreaSize
  const win = new BrowserWindow({
    // resizable: false,
    // frame: false,
    autoHideMenuBar: true,
    width: width /2, 
    height: height /2,
    webPreferences:  {
      nodeIntegration: true,
      preload: path.resolve(__dirname, "./preload/preload.cjs")
    }
  }) 

  win.loadFile(htmlDistPath)
  win.webContents.openDevTools
  win.webContents.send("message", "message-content");
  return win
}

export default initBrowserWindow

