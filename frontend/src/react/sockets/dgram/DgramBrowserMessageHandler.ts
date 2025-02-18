

type DgramSocketHandlerArgs = {
  msgData: any
}


type DgramSocketHandler = (arg: DgramSocketHandlerArgs) => void

export default class DgramBrowserMessageHandler {

  protected handlerMap: Map<string, DgramSocketHandler>
  
  constructor() {
    this.handlerMap = new Map([
      ['trackingUser', this.trackingUser.bind(this)],
    ])
  }

  public getHandler(action: string) {
    return this.handlerMap.get(action)
  }

  protected trackingUser({ msgData }: DgramSocketHandlerArgs) {
    console.log(msgData)
  }

}