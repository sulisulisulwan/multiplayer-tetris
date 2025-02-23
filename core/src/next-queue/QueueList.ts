
type QueueTail<T> = {
  prev: QueueNode<T> | QueueHead<T>
}

type QueueHead<T> = {
  next: QueueNode<T> | QueueTail<T>
}

class QueueNode<K> {

  protected data: K
  public next: QueueNode<K> | QueueTail<K>
  public prev: QueueNode<K> | QueueHead<K>

  constructor(data: K, next: QueueNode<K> | QueueTail<K>, prev: QueueNode<K> | QueueHead<K>) {
    this.data = data
    this.next = next
    this.prev = prev
  }

  getData():K {
    return this.data
  }

}


export class QueueList<T> {

  private head: QueueHead<T>
  private tail: QueueTail<T>
  private length: number

  constructor() {
    this.head = { next: this.tail }
    this.tail = { prev: this.head }
    this.head.next = this.tail
    this.length = 0
  }

  public enqueueToList(data: T): void {

    
    
    if (this.head.next !== null && !this.head.next.hasOwnProperty('next')) {
      let node = new QueueNode(data, this.tail, this.head)
      this.head.next = node
      node.next = this.tail
      this.tail.prev = node
      this.length += 1
      return
    }
    
    let node = new QueueNode(data, this.tail,this.tail.prev)
    node.prev = this.tail.prev
    node.prev
    this.tail.prev.next = node

    node.next = this.tail
    this.tail.prev = node
    this.length += 1
  }

  public dequeueFromList(): T | null {

    if (!this.head.next.hasOwnProperty('next')) {
      return null
    }

    const dequeued = this.head.next as QueueNode<T>
    this.head.next = dequeued.next
    dequeued.next.prev = this.head;

    (dequeued as any).next = null;
    (dequeued as any).prev = null

    this.length -= 1
    return dequeued.getData()

  }

  public queueToArray(length: number): T[] {

    let counter = Infinity
    if (length) {
      counter = length
    }

    const queue: T[] = []

    if (!this.head.next.hasOwnProperty('next')) return []
    
    let curr = this.head.next

    while (curr.hasOwnProperty('next')) {
      if (!counter) {
        break
      }
      queue.push((curr as QueueNode<T>).getData())

      curr = (curr as QueueNode<T>).next
      counter -= 1
    }

    return queue
  }

  clearQueue() {
    if (this.head.next.hasOwnProperty('next')) {
      (this.head.next as any).prev = null
    }

    if (this.tail.prev.hasOwnProperty('prev')) {
      (this.tail.prev as any).next = null
    }

    this.head.next = this.tail
    this.tail.prev = this.head
    this.length = 0
  }

  public logQueue(length: number): void {
    const queue = this.queueToArray(length)
    console.log(
      'QUEUE: ', queue,
      'queueLength: ', this.getLength()
    )
  }

  public getLength(): number {
    return this.length
  }

}