import { Tetrimino } from 'multiplayer-tetris-types'
import { VirtualBag } from './VirtualBag.js'
import { QueueList } from './QueueList.js'
import { TetriminoFactory } from '../tetrimino/TetriminoFactory.js'

export class NextQueue {

  private virtualBag: VirtualBag
  private queue: QueueList<string>

  constructor() {
    this.virtualBag = new VirtualBag()
    this.queue = this.initiateQueue()
  }

  public dequeue(): Tetrimino {
    if (this.virtualBag.getBagLength() === 0) {
      this.virtualBag.fillBag()
    }
    const tetrimino = this.virtualBag.popTetriminoFromBag()
    this.queue.enqueueToList(tetrimino)
    const context = this.queue.dequeueFromList()
    if (!context) {
      throw new Error('Illegal context in NextQueue.  Check the return value of this.queue.dequeueFromList')
    }
    return TetriminoFactory.getTetrimino(context)
  }
  
  public queueToArray(length: number): string[] {
    return this.queue.queueToArray(length)
  }

  public logQueue(length: number) {
    this.queue.logQueue(length)
  }

  private initiateQueue(): QueueList<string> {

    const queue = new QueueList<string>()
    const startingBag = new VirtualBag()
    const bagLength = startingBag.getBagLength()
    for(let i = 0; i < bagLength; i += 1) {
      const tetrimino = startingBag.popTetriminoFromBag()
      queue.enqueueToList(tetrimino)
    }
    return queue

  }
}
