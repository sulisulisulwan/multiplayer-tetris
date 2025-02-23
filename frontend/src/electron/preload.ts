import { contextBridge, ipcRenderer, webFrame } from "electron"
import axios from 'axios'
contextBridge.exposeInMainWorld("electronBridge", {
  axiosPost: async (url: string, data: any) => {
    const resp = await axios.post(url, data)
    return resp
  },
  axiosGet: async (url: string, config?: any) => {
    const resp = await axios.get(url, config)
    return resp
  },
  sendToElectron: (channel: string, args: any[]) => { return ipcRenderer.invoke(channel, args)},
  receiveFromElectron: (channel: string, func: Function) => {
    //func is the callback set on React to run if main sends a message to Renderer
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  }
})
