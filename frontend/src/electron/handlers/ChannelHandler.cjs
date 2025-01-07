const { ipcMain } = require("electron")

module.exports = class ChannelHandler {

  constructor(electronApp) {
    this.app = electronApp
    this.name = null
    this.callback = null
  }

  setName(name) {
    this.name = name
    return this
  }

  setCallback(callback) {
    this.callback = callback.bind(this.app)
    return this
  }

  loadHandler() {

    if (this.name === null) {
      throw new Error('ChannelHandler name is null.  Name must be set with ChannelHandler.setName(<string>)')
    }

    if (this.callback === null) {
      throw new Error('ChannelHandler callback is null.  Callback must be set with ChannelHandler.setCallback(<Function>)')
    }
    
    ipcMain.handle(this.name, this.callback.bind(this.app))
  }
}