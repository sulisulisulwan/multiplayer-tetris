const { contextBridge, ipcRenderer } = require("electron")


contextBridge.exposeInMainWorld("electronBridge", {
  node: () => () => process.electronBridge.node,
  electron: () => process.electronBridge.electron,
  chrome: () => process.electronBridge.electron,
  sendToElectron: (channel, args) => { return ipcRenderer.invoke(channel, args)},
  receiveFromElectron: (channel, func) => {
    //func is the callback set on React to run if main sends a message to Renderer
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
})
