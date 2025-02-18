import * as Dgram from 'node:dgram'
import MessageHandler from './DgramMessageHandler.js'
import { SocketDataItem, SocketId, UserId } from 'multiplayer-tetris-types'
import { DgramServerToClient, SocketDataItemDgram } from 'multiplayer-tetris-types/shared/types.js'
import chalk = require('chalk')

export default class Server {
  
  protected port: number
  protected db: any
  protected remoteAddressInfo: {
    userId: Record<UserId, any>
    remoteAddressInfo: Record<string, UserId>
  }
  protected messageHandler: MessageHandler
  protected server: Dgram.Socket

  constructor() {
    this.port = 41234
    this.db = null
    this.remoteAddressInfo = {
      userId: {},
      remoteAddressInfo: {}
    }
    this.messageHandler = new MessageHandler(this)
    this.server = Dgram.createSocket('udp4')
    this.initListeners()
  }

  public setUserIdToRemoteAddressInfo(userId: UserId, rinfo: Dgram.RemoteInfo) {
    this.remoteAddressInfo.userId[userId] = rinfo
    this.remoteAddressInfo.remoteAddressInfo[`${rinfo.address}:${rinfo.port}`] = userId
  }

  public getUserIdByRemoteAddressInfo(rinfo: Dgram.RemoteInfo) {
    return this.remoteAddressInfo.remoteAddressInfo[`${rinfo.address}:${rinfo.port}`] || null
  }

  public getRemoteAddressInfoByUserId(userId: UserId) {
    return this.remoteAddressInfo.userId[userId]
  }

  public to(roomId: string) {
    console.log('need to implement public to(roomId: string)')
    return {
      emit(action: string, socketDataItem: SocketDataItem<DgramServerToClient>) {

      }
    }
  }

  private initListeners() {
    const onMessage = this.onMessage.bind(this)
    const onDisconnect = this.onDisconnect.bind(this)
    this.server
      .on('listening', () => {
        const { address, port } = this.server.address()
        console.log(`DgramServer listening on ${address}:${port}`)
      })
      .on('message', (bufferData, rinfo) => { 
        const socketDataItem = JSON.parse(bufferData.toString()); 
        onMessage(rinfo, socketDataItem) 
      })
      .on('disconnect', onDisconnect)
      .on('error', (err: Error) => console.error(err))
      .bind(this.port)
  }


  // private async send(socket: Socket, socketDataItem: SocketDataItem<DgramServerToClient>) {
  public async send(rinfo: Dgram.RemoteInfo, socketDataItem: SocketDataItem<DgramServerToClient>) {
    const { port, address } = rinfo
    console.log(`${chalk.blue('DGRAM Message')} to ${chalk.bgYellow(this.getUserIdByRemoteAddressInfo(rinfo))}: ${chalk.greenBright(socketDataItem.action)}`)
    this.server.send(JSON.stringify(socketDataItem), port, address)
  }

  // private async onMessage(socket: Socket, action: string, data: any) {
  private async onMessage(rinfo: Buffer, socketDataItem: SocketDataItemDgram<any>) {
    if (!socketDataItem.action) return
    const { action, userId } = socketDataItem
    console.log(`${chalk.blue('DGRAM Message')} from ${chalk.bgYellow(userId)}: ${chalk.magentaBright(action)}`)
    const handler = this.messageHandler.getHandler(action)
    await handler(rinfo, socketDataItem)
  }
  // private async onDisconnect(socket: Socket) {}
  private async onDisconnect(socket: any) {}

  getSocket() {
    return this.server
  }

}

