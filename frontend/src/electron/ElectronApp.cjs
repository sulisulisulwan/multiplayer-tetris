

const { app } = require("electron");
const path = require("node:path")
const initBrowserWindow = require("./initBrowserWindow.cjs");
const DatagramClient = require("./dgramClient/DatagramClient.cjs");
const ChannelHandler = require("./handlers/ChannelHandler.cjs");

class ElectronApp {

  constructor() {
    this.dgramClient = new DatagramClient('localhost', 41234, this)
    this.window = null
  }

  get dgram () {
    return this.dgramClient
  }

  init() {

    (async() => {
  
      await app.whenReady()
      const handlerConfigs = require('./handlers/handlerConfigs/index.cjs')
      this.loadHandlers(handlerConfigs)
      
      this.window = initBrowserWindow()
      this.datagramClient
    
      if (process.argv[2] === "-DEV") {
        const hotReloader = (await import("electron-webpack-hotreload")).default
        const webpackConfig = (await import("../../webpack.config.js")).default
        const htmlPath = path.resolve(__dirname, "../../dist/index.html")
    
        hotReloader({
          window: this.window , 
          webpackConfig, 
          htmlPath
        })
    
      }
      
    })()

  }
  
  loadHandlers(handlerConfigs) {
    handlerConfigs.forEach((handlerConfig) => {
      new ChannelHandler(this)
        .setName(handlerConfig.name)
        .setCallback(handlerConfig.callback)
        .loadHandler()
    })
  }
  

}




module.exports = ElectronApp
