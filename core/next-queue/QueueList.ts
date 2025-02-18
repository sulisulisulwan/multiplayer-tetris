class QueueNode<K> {

  protected data: K
  public next: QueueNode<K> | null
  public prev: QueueNode<K> | null

  constructor(data: K) {
    this.data = data
    this.next = null
    this.prev = null
  }

  getData() {
    return this.data
  }

}

export class QueueList<T> {

  private head: QueueNode<T>
  private tail: QueueNode<T>
  private length: number

  constructor() {
    this.head = new QueueNode(null)
    this.tail = new QueueNode(null)
    this.head.next = this.tail
    this.tail.prev = this.head
    this.length = 0
  }

  public enqueueToList(data: T): void {

    let node = new QueueNode(data)

    if (this.head.next.getData() === null) {
      this.head.next = node
      node.next = this.tail
      this.tail.prev = node
      this.length += 1
      return
    }
    
    node.prev = this.tail.prev
    this.tail.prev.next = node

    node.next = this.tail
    this.tail.prev = node
    this.length += 1
  }

  public dequeueFromList(): QueueNode<T> {

    if (this.head.next.getData() === null) {
      return null
    }

    const dequeued = this.head.next
    this.head = this.head.next
    this.length -= 1
    return dequeued

  }

  public queueToArray(length: number): T[] {

    let counter = Infinity
    if (length) {
      counter = length
    }

    const queue = []
    let curr = this.head.next !== null ? this.head.next : this.head

    while (curr.next !== null) {
      if (!counter) {
        break
      }
      queue.push(curr.getData())
      curr = curr.next
      counter -= 1
    }

    return queue
  }

  clearQueue() {
    this.head = new QueueNode(null)
    this.tail = new QueueNode(null)
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

  public peek(): T {
    return this.head.getData()
  }

}