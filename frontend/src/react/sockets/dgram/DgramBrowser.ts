class DgramBrowser {

  protected onReceive: any
  protected sendMessage: any

  constructor() {
    this.onReceive = (window as any).electronBridge.receiveFromElectron
    this.sendMessage = (window as any).electronBridge.sendToElectron
  }

  onMessage(callback: Function) {
    this.onReceive('dgram:in', callback)
  }

  send(data: any) {
    this.sendMessage('dgram', data)
  }
}

export default new DgramBrowser()