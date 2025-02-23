import { BaseTetrimino, Tetrimino } from "multiplayer-tetris-types"

type FactoryFuncs = {
  getITetrimino: Function,
  getOTetrimino: Function,
  getTTetrimino: Function,
  getJTetrimino: Function,
  getLTetrimino: Function,
  getSTetrimino: Function,
  getZTetrimino: Function
}


export class TetriminoFactory {


  private static factoryFunctions: FactoryFuncs = {
    getITetrimino: TetriminoFactory.getITetrimino,
    getOTetrimino: TetriminoFactory.getOTetrimino,
    getTTetrimino: TetriminoFactory.getTTetrimino,
    getJTetrimino: TetriminoFactory.getJTetrimino,
    getLTetrimino: TetriminoFactory.getLTetrimino,
    getSTetrimino: TetriminoFactory.getSTetrimino,
    getZTetrimino: TetriminoFactory.getZTetrimino
  }

  private static getBaseTetrimino(): BaseTetrimino {
    return {
      startingGridPosition: [18, 2],
      currentOriginOnPlayfield: [18, 2],
      localGridSize: 3,
      currentOrientation: 'north',
      status: 'inQueue',
      ghostCoordsOnPlayfield: []
    }
  }

  public static getTetrimino(tetrimino: string): Tetrimino {
    const factoryFunc = `get${tetrimino}`

    return TetriminoFactory.factoryFunctions[factoryFunc as keyof FactoryFuncs]()
  }

  public static resetTetrimino(tetrimino: Tetrimino) {
    return TetriminoFactory.getTetrimino(tetrimino.name as string)
  }
  
  protected static getITetrimino(): Tetrimino {
    const tetrimino: Tetrimino = { 
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'ITetrimino',
      minoGraphic: '[i]',
      startingGridPosition: [19, 3],
      currentOriginOnPlayfield: [19, 3],
      localGridSize: 4,
      orientations: {
    
      /**
       * [
       *  '[]','[]','[]',[],
       *  '[]','[]','[]',[],
       *  '[]','[]','[]',[],
       *  '[]','[]','[]',[],
       * ]
       */
      north: {
        topBorderCoords: [[0,0], [0,1], [0,2], [0,3]],
        coordsOffOrigin: [[1,0], [1,1], [1,2], [1,3]],
        rotationPoints: { '1': [1,1], '2': [1,0], '3': [1,3], '4': [1,0], '5': [1,3] },
        lowestRowOffOrigin: 1
      },
      /**
       * [
       *  '[_]','[_]','[_]',[_],
       *  '[i]','[i]','[i]',[i],
       *  '[_]','[_]','[_]',[_],
       *  '[_]','[_]','[_]',[_],
       * ]
       */
      east: {
        topBorderCoords: [[-1,2]],
        coordsOffOrigin: [[0,2], [1,2], [2,2], [3,2]],
        rotationPoints: { '1': [1,1], '2': [1,2], '3': [1,2], '4': [0,2], '5': [3,2] },
        lowestRowOffOrigin: 3      
      },
      /**
       * [
       *  '[_]','[_]','[_]',[_],
       *  '[_]','[_]','[_]',[_],
       *  '[i]','[i]','[i]',[i],
       *  '[_]','[_]','[_]',[_],
       * ]
       */
      south: {
        topBorderCoords: [[1,0], [1,1], [1,2], [1,3]],
        coordsOffOrigin: [[2,0], [2,1], [2,2], [2,3]],
        rotationPoints: { '1': [1,1], '2': [1,3], '3': [1,0], '4': [2,2], '5': [2,0] },
        lowestRowOffOrigin: 2
      },
      /**
       * [
       *  '[_]','[i]','[_]',[_],
       *  '[_]','[i]','[_]',[_],
       *  '[_]','[i]','[_]',[_],
       *  '[_]','[i]','[_]',[_],
       * ]
       */
      west: {
        topBorderCoords: [[-1,1]],
        coordsOffOrigin: [[0,1], [1,1], [2,1], [3,1]],
        rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [3,1], '5': [0,1] },
        lowestRowOffOrigin: 3
      }
      }  
    }
    return tetrimino
  }

  protected static getOTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'OTetrimino',
      minoGraphic: '[o]',
      startingGridPosition: [18, 3],
      currentOriginOnPlayfield: [18, 3],
      orientations: {
        /**
         * [
         *  '[_]','[o]','[o]',
         *  '[_]','[o]','[o]',
         *  '[_]','[_]','[_]',
         * ]
         */
        north: {
          topBorderCoords: [[-1,1], [-1,2]],
          coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[o]','[o]'
         *  '[_]','[o]','[o]'
         *  '[_]','[_]','[_]'
         * ]
         */
        east: {
          topBorderCoords: [[-1,1], [-1,2]],
          coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[o]','[o]'
         *  '[_]','[o]','[o]'
         *  '[_]','[_]','[_]'
         * ]
         */
        south: {
          topBorderCoords: [[-1,1], [-1,2]],
          coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[o]','[o]'
         *  '[_]','[o]','[o]'
         *  '[_]','[_]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,1], [-1,2]],
          coordsOffOrigin: [[0,1], [0,2], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        }
      } 
    }
    
    return tetrimino
  }

  protected static getJTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'JTetrimino',
      minoGraphic: '[j]',
      orientations: {
        /**
         * [
         *  '[j]','[_]','[_]'
         *  '[j]','[j]','[j]'
         *  '[_]','[_]','[_]'
         * ]
         */
        north: {
          topBorderCoords: [[-1,0], [0,1], [0,2]],
          coordsOffOrigin: [[0,0], [1,0], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[j]','[j]'
         *  '[_]','[j]','[_]'
         *  '[_]','[j]','[_]'
         * ]
         */
        east: {
          topBorderCoords: [[-1,1], [-1,2]],
          coordsOffOrigin: [[0,1], [0,2], [1,1], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[_]','[_]'
         *  '[j]','[j]','[j]'
         *  '[_]','[_]','[j]'
         * ]
         */
        south: {
          topBorderCoords: [[0,0], [0,1], [0,2]],
          coordsOffOrigin: [[1,0], [1,1], [1,2], [2,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[j]','[_]'
         *  '[_]','[j]','[_]'
         *  '[j]','[j]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,1], [1,0]],
          coordsOffOrigin: [[0,1], [1,1], [2,0], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
          lowestRowOffOrigin: 2
        }
      }
    }

    return tetrimino
  }

  protected static getLTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'LTetrimino',
      minoGraphic: '[l]',
      orientations: {
        /**
         * [
         *  '[_]','[_]','[l]'
         *  '[l]','[l]','[l]'
         *  '[_]','[_]','[_]'
         * ]
         */
        north: {
          topBorderCoords: [[-1,2], [0,0], [0,1]],
          coordsOffOrigin: [[0,2], [1,0], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[l]','[_]'
         *  '[_]','[l]','[_]'
         *  '[_]','[l]','[l]'
         * ]
         */
        east: {
          topBorderCoords: [[-1,1], [1,2]],
          coordsOffOrigin: [[0,1], [1,1], [2,1], [2,2]],
          rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[_]','[l]'
         *  '[l]','[l]','[l]'
         *  '[_]','[_]','[_]'
         * ]
         */
        south: {
          topBorderCoords: [[0,0], [0,1], [0,2]],
          coordsOffOrigin: [[1,0], [1,1], [1,2], [2,0]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[l]','[l]','[_]'
         *  '[_]','[l]','[_]'
         *  '[_]','[l]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,0], [-1,1]],
          coordsOffOrigin: [[0,0], [0,1], [1,1], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
          lowestRowOffOrigin: 2
        }
      }
    }
    
    return tetrimino
  }

  protected static getSTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name:'STetrimino',
      minoGraphic: '[s]',
      orientations: {
        /**
         * [
         *  '[_]','[s]','[s]'
         *  '[s]','[s]','[_]'
         *  '[_]','[_]','[_]'
         * ]
         */
        north: {
          topBorderCoords: [[-1,1], [-1,2],[0,0]],
          coordsOffOrigin: [[0,1], [0,2], [1,0], [1,1]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[s]','[_]'
         *  '[_]','[s]','[s]'
         *  '[_]','[_]','[s]'
         * ]
         */
        east: {
          topBorderCoords: [[-1,1],[0,2]],
          coordsOffOrigin: [[0,1], [1,1], [1,2], [2,2]],
          rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[_]','[_]'
         *  '[_]','[s]','[s]'
         *  '[s]','[s]','[_]'
         * ]
         */
        south: {
          topBorderCoords: [[0,1], [0,2],[1,0]],
          coordsOffOrigin: [[1,1], [1,2], [2,0], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[s]','[_]','[_]'
         *  '[s]','[s]','[_]'
         *  '[_]','[s]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,0],[0,1]],
          coordsOffOrigin: [[0,0], [1,0], [1,1], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
          lowestRowOffOrigin: 2
        }
      }
    }

    return tetrimino
  }

  protected static getZTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'ZTetrimino',
      minoGraphic: '[z]',
      orientations: {
        /**
         * [
         *  '[z]','[z]','[_]'
         *  '[_]','[z]','[z]'
         *  '[_]','[_]','[_]'
         * ]
         */
        north: {
          topBorderCoords: [[-1,0], [-1,1],[0,2]],
          coordsOffOrigin: [[0,0], [0,1], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
        /**
         * [
         *  '[_]','[_]','[z]'
         *  '[_]','[z]','[z]'
         *  '[_]','[z]','[_]'
         * ]
         */      
        east: {
          topBorderCoords: [[-1,2], [0,1]],
          coordsOffOrigin: [[0,2], [1,1], [1,2], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[_]','[_]'
         *  '[z]','[z]','[_]'
         *  '[_]','[z]','[z]'
         * ]
         */ 
        south: {
          topBorderCoords: [[0,0], [0,1],[1,2]],
          coordsOffOrigin: [[1,0], [1,1], [2,1], [2,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[z]','[_]'
         *  '[z]','[z]','[_]'
         *  '[z]','[_]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,1], [0,0]],
          coordsOffOrigin: [[0,1], [1,0], [1,1], [2,0]],
          rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
          lowestRowOffOrigin: 2
        }
      } 
    }
    

    return tetrimino
  }

  protected static getTTetrimino(): Tetrimino {
    const tetrimino: Tetrimino = {
      ...TetriminoFactory.getBaseTetrimino(),
      name: 'TTetrimino',
      minoGraphic: '[t]',
      orientations: {
        /**
         * [
         *  '[_]','[t]','[_]'
         *  '[t]','[t]','[t]'
         *  '[_]','[_]','[_]'
         * ]
         */
  
        north: {
          topBorderCoords: [[-1,1], [0,0], [0,2]],
          coordsOffOrigin: [[0,1], [1,0], [1,1], [1,2]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 1
        },
              /**
         * [
         *  '[_]','[t]','[_]'
         *  '[_]','[t]','[t]'
         *  '[_]','[t]','[_]'
         * ]
         */
        east: {
          topBorderCoords: [[-1,1], [0,2]],
          coordsOffOrigin: [[0,1], [1,1], [1,2], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,2], '3': [2,2], '4': [-1,1], '5': [-1,2] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[_]','[_]'
         *  '[t]','[t]','[t]'
         *  '[_]','[t]','[_]'
         * ]
         */
        south: {
          topBorderCoords: [[0,0], [0,1], [0,2]],
          coordsOffOrigin: [[1,0], [1,1], [1,2] , [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1] },
          lowestRowOffOrigin: 2
        },
        /**
         * [
         *  '[_]','[t]','[_]'
         *  '[t]','[t]','[_]'
         *  '[_]','[t]','[_]'
         * ]
         */
        west: {
          topBorderCoords: [[-1,1], [0,0]],
          coordsOffOrigin: [[0,1], [1,0], [1,1], [2,1]],
          rotationPoints: { '1': [1,1], '2': [1,0], '3': [2,0], '4': [-1,1], '5': [-1,0] },
          lowestRowOffOrigin: 2
        }
      } 
    }
    

    return tetrimino
  }

}