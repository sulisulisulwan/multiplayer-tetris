import { contextBridge, ipcRenderer, webFrame } from "electron"

contextBridge.exposeInMainWorld("electronBridge", {
  sendToElectron: (channel: string, args: any[]) => { return ipcRenderer.invoke(channel, args)},
  receiveFromElectron: (channel: string, func: Function) => {
    //func is the callback set on React to run if main sends a message to Renderer
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
})
