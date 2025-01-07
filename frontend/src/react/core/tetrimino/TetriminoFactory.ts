import { tetriminoIF } from "../../types"


type factoryFuncs = {
  getITetrimino: Function,
  getOTetrimino: Function,
  getTTetrimino: Function,
  getJTetrimino: Function,
  getLTetrimino: Function,
  getSTetrimino: Function,
  getZTetrimino: Function
}


export class TetriminoFactory {


  private static factoryFunctions: factoryFuncs = {
    getITetrimino: TetriminoFactory.getITetrimino,
    getOTetrimino: TetriminoFactory.getOTetrimino,
    getTTetrimino: TetriminoFactory.getTTetrimino,
    getJTetrimino: TetriminoFactory.getJTetrimino,
    getLTetrimino: TetriminoFactory.getLTetrimino,
    getSTetrimino: TetriminoFactory.getSTetrimino,
    getZTetrimino: TetriminoFactory.getZTetrimino
  }

  private static getBaseTetrimino(): tetriminoIF {
    return {
      startingGridPosition: [18, 2],
      currentOriginOnPlayfield: [18, 2],
      localGridSize: 3,
      currentOrientation: 'north',
      status: 'inQueue',
      ghostCoordsOnPlayfield: []
    }
  }

  public static getTetrimino(tetrimino: string): tetriminoIF {
    const factoryFunc = `get${tetrimino}`

    return TetriminoFactory.factoryFunctions[factoryFunc as keyof factoryFuncs]()
  }

  public static resetTetrimino(tetrimino: tetriminoIF) {
    return TetriminoFactory.getTetrimino(tetrimino.name)
  }
  
  protected static getITetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'ITetrimino'
    tetrimino.minoGraphic = '[i]'
    tetrimino.startingGridPosition = [19, 3]
    tetrimino.currentOriginOnPlayfield = [19, 3]
    tetrimino.localGridSize = 4
    tetrimino.orientations = {
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

    return tetrimino
  }

  protected static getOTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'OTetrimino'
    tetrimino.minoGraphic = '[o]',
    tetrimino.startingGridPosition = [18, 3],
    tetrimino.currentOriginOnPlayfield = [18, 3],
    tetrimino.orientations = {
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
    
    return tetrimino
  }

  protected static getJTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'JTetrimino'
    tetrimino.minoGraphic = '[j]'
    tetrimino.orientations = {
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

    return tetrimino
  }

  protected static getLTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'LTetrimino'
    tetrimino.minoGraphic = '[l]'
    tetrimino.orientations = {
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

    return tetrimino
  }

  protected static getSTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'STetrimino'
    tetrimino.minoGraphic = '[s]'
    tetrimino.orientations = {
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

    return tetrimino
  }

  protected static getZTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'ZTetrimino'
    tetrimino.minoGraphic = '[z]'
    tetrimino.orientations = {
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

    return tetrimino
  }

  protected static getTTetrimino(): tetriminoIF {
    const tetrimino = TetriminoFactory.getBaseTetrimino()
    tetrimino.name = 'TTetrimino'
    tetrimino.minoGraphic = '[t]'
    tetrimino.orientations = {
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

    return tetrimino
  }

}