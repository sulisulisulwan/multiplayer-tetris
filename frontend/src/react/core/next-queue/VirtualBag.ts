export class VirtualBag {

  public bag: string[]
  private tetriminos: string[]

  constructor() {
    this.tetriminos = [
      'ITetrimino', 
      // 'OTetrimino', 
      // 'STetrimino', 
      // 'ZTetrimino',
      // 'JTetrimino', 
      // 'LTetrimino',
      // 'TTetrimino',
    ]
    this.bag = this.getShuffledTetriminos() || []
  }

  public getShuffledTetriminos(): string[] {

    const tetriminos = this.tetriminos.slice()
    const shuffledTetriminos = []

    for (let i = 0; i < this.tetriminos.length; i += 1) {
      const randomIndex = Math.floor(Math.random() * tetriminos.length)
      shuffledTetriminos.push(tetriminos.splice(randomIndex, 1)[0])
    }

    return shuffledTetriminos
  }

  public fillBag(): void {
    this.bag = this.getShuffledTetriminos()
  }


  public popTetriminoFromBag(): string {
    if (!this.getBagLength()) {
      throw new Error('Virtual Bag Empty.  Cannot pop from bag.')
    }
    return this.bag.pop()
  }

  public getBagLength(): number {
    return this.bag.length
  }

}