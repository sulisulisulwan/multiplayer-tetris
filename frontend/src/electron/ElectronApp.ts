import { app, globalShortcut, BrowserWindow, webFrame, Menu } from 'electron'
import initBrowserWindow from "./initBrowserWindow"
import DatagramClient from "./dgramClient/DatagramClient"
import WebsocketClient from "./websocketClient/WebsocketClient"
import ChannelHandlerLoader from "./handlers/ChannelHandlerLoader"
import { HandlerConfig } from 'multiplayer-tetris-types'
import { watch } from 'fs/promises'
import chalk = require('chalk')

let menuTemplate = [
  {
      label: "Window Manager",
      submenu: [
          { 
            label: "Quit Multiplayer Tetris",
            role: 'quit'
          }
      ]
  }
];

class ElectronApp {
  
  protected dgramClient: DatagramClient
  protected websocketClient: WebsocketClient
  protected window: BrowserWindow
  protected htmlDistPath: string

  constructor(htmlDistPath: string) {
    this.dgramClient = new DatagramClient(this)
    this.websocketClient = new WebsocketClient(this)
    this.window = null
    this.htmlDistPath = htmlDistPath
  }

  public getWindow() {
    return this.window
  }

  public getRootHtmlPath() {
    return this.htmlDistPath
  }

  public init() {
    (async() => {
      await app.whenReady()
      const handlerConfigs = require('./handlers/handlerConfigs/index').default
      this.loadHandlers(handlerConfigs)
      this.window = initBrowserWindow(this.htmlDistPath);
      let menu = Menu.buildFromTemplate(menuTemplate as any);
      // Menu.setApplicationMenu(menu);
      this.window.setAspectRatio(16/9)

      app.on('browser-window-focus', function () {
        globalShortcut.register("CommandOrControl+R", () => {
            console.log("CommandOrControl+R is pressed: Shortcut Disabled");
        });
        globalShortcut.register("F5", () => {
            console.log("F5 is pressed: Shortcut Disabled");
        });
      });
      
    })()

  }

  async restart() {
    console.log(chalk.yellow('Restarting Electron App'))
    await this.websocketClient.kill()
    await this.dgramClient.kill()

    this.getWindow().loadFile(this.getRootHtmlPath())
  }


  protected loadHandlers(handlerConfigs: HandlerConfig[]) {
    handlerConfigs.forEach((handlerConfig) => {
      new ChannelHandlerLoader(this)
        .setName(handlerConfig.name)
        .setCallback(handlerConfig.callback)
        .loadHandler()
    })
  }
}









export default ElectronApp
