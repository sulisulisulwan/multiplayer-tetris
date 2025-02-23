import { SocketDataItem } from "multiplayer-tetris-types"
import DgramServer from "./DgramServer"
import { DgramServerToClient, RoomId, ServerToClientActions, SocketDataItemDgram } from "multiplayer-tetris-types/shared/types"
import chalk from "chalk"
import { RemoteInfo } from "node:dgram"

type HandlerMap = Map<string, Function>

export default class MessageHandler {

  protected server: DgramServer
  protected db: any
  protected handlerMap: HandlerMap
  actions: any

  constructor(server: DgramServer) {
    this.server = server
    this.db = null
    this.handlerMap = this.initMap()
  }

  public getHandler(action: string): Function {
    const handler = this.handlerMap.get(action)
    if (!handler) throw new Error(`Handler for action '${action}' is not yet a valid handler (presumably '_handler_${action}').  Choose a different handler or implement the chosen handler`)
    return handler
  }

  protected initMap() {
    return new Map([
      ['trackThisUser', this.trackThisUser.bind(this)],
      ['activateGame', this.activateGame.bind(this)],
      ['handleKeyStroke', this.handleKeyStroke.bind(this)],
    ])
  }

  protected broadcastTo(roomId: RoomId, socketDataItem: SocketDataItem<DgramServerToClient/**This needs a type specific to DGRAM */>) {
    console.log(`Message broadcast to room ${chalk.bgYellow(roomId)}: ${chalk.greenBright(socketDataItem.action)}`)
    const { action, data } = socketDataItem
    if (!action) return
    this.server.to(roomId).emit('messageFromServer', { action, data })
  }

  // send(socket: Socket, socketDataItem: SocketDataItem<ServerToClientActions>) {
  protected send(rinfo: any, socketDataItem: SocketDataItem<DgramServerToClient>) {
    this.server.send(rinfo, socketDataItem)
  }

  // protected _handle_demo(socket: Socket, socketDataItem: SocketDataItem<ServerToClientActions>) {
  protected trackThisUser(rinfo: RemoteInfo, socketDataItem: SocketDataItemDgram<any>) {
    
    const userIsTracked = !!this.server.getRemoteAddressInfoByUserId(socketDataItem.userId)

    this.server.setUserIdToRemoteAddressInfo(socketDataItem.userId, rinfo)
    this.send(rinfo, {
      action: 'trackingUser', 
      data: { 
        userId: socketDataItem.userId, 
        activateNewGame: !userIsTracked
      } 
    })
  }


  protected activateGame(rinfo: RemoteInfo, socketDataItem: SocketDataItemDgram<any>) {
    const gameRoom = this.server.getGameRoom()
    gameRoom.activateLoop()
  }


  protected handleKeyStroke(rinfo: RemoteInfo, socketDataItem: SocketDataItemDgram<any>) {
    const { key, type } = socketDataItem.data
    const gameRoom  = this.server.getGameRoom()
    const playerActionHandler = gameRoom.getPlayerActionHandler()
    const dispatch = gameRoom.getDispatch()
    const { gameState }= gameRoom.getState()
    playerActionHandler.keystrokeHandler({ key, type}, gameState, dispatch)
  }

}