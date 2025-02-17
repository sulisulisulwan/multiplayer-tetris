import { ipcMain } from "electron"
import ElectronApp from "../ElectronApp"

export default class ChannelHandlerLoader {

  protected app: ElectronApp
  protected name: string
  protected callback: Function

  constructor(electronApp: ElectronApp) {
    this.app = electronApp
    this.name = null
    this.callback = null
  }

  setName(name: string) {
    this.name = name
    return this
  }

  setCallback(callback: Function) {
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