export interface HandlerConfig {
  name: string
  callback: Function
}

export interface ElectronWindow extends Window {
  electronBridge: {
    receiveFromElectron: Function
    sendToElectron: Function
    initWebsocket: Function
    killWebsocket: Function
    initDgramSocket: Function
    killDgramSocket: Function
  }
}