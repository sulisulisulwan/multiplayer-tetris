import Server from "./DgramServer.js"
export default class GameEngine {

  protected dgramServer: Server
  protected playerData: {}

  constructor() {
    this.dgramServer = new Server()
    this.dgramServer.init(41234)
    this.playerData = {

    }
  }

  serverErrorHandler() {
    this.dgramServer.getSocket().on('error', (err: Error) => {
      console.error(`server error:\n${err.stack}`)
    })
  }



}