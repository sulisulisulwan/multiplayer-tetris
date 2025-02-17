

  /**                             0  1 
   *                   minoAt? = [y, x]
   *       v----------------------|--+
   *    x  x                      |
   * [                            |
   *  [_],[0],[_],     y          |
   *  [1],[2],[3],     y   <------+
   *  [_],[_],[_],     y
   * ]
   */

import { Coordinates, TSlotCornersGettersMap, IsATSlotCornerMap } from "multiplayer-tetris-types/frontend/core"

  /*
   * if the t-slot square isn't an empty square 
   * (either it's off the playfield (undefined) or filled with a tetrimino), 
   * it is a tslot
   */ 

export class TSpinCalculator {

  private static tSlotCornersGetters: TSlotCornersGettersMap = {
    getTSlotCorners_north: TSpinCalculator.getTSlotCorners_north,
    getTSlotCorners_south: TSpinCalculator.getTSlotCorners_south,
    getTSlotCorners_east: TSpinCalculator.getTSlotCorners_east,
    getTSlotCorners_west: TSpinCalculator.getTSlotCorners_west
  }

  static getTSlotCorners_north(tetriminoCoordsOnPlayfield: Coordinates[], playfield: string[][]) {
    
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino1 = tetriminoCoordsOnPlayfield[1]
    const mino3 = tetriminoCoordsOnPlayfield[3]


    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]

    const down1From1 = playfield[mino1[0] + 1] ? playfield[mino1[0] + 1][mino1[1]] : undefined 
    const down1From3 = playfield[mino3[0] + 1] ? playfield[mino3[0] + 1][mino3[1]] : undefined

    const isATSlotCorner: IsATSlotCornerMap = {
      a: leftOf0 !== '[_]',
      b: rightOf0 !== '[_]',
      c: down1From1 !== '[_]',
      d: down1From3 !== '[_]'
    }

    return isATSlotCorner
  }

  static getTSlotCorners_east(tetriminoCoordsOnPlayfield: Coordinates[], playfield: string[][]) {
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]
    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]

    const isATSlotCorner: IsATSlotCornerMap = {
      a: rightOf0 !== '[_]',
      b: rightOf3 !== '[_]',
      c: leftOf0 !== '[_]',
      d: leftOf3 !== '[_]'
    }

    return isATSlotCorner
  }

  static getTSlotCorners_south(tetriminoCoordsOnPlayfield: Coordinates[], playfield: string[][]) {
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino2 = tetriminoCoordsOnPlayfield[2]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]   
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]

    const up1From2 = playfield[mino2[0] - 1] ? playfield[mino2[0] - 1][mino2[1]] : undefined 
    const up1From0 = playfield[mino0[0] - 1] ? playfield[mino0[0] - 1][mino0[1]] : undefined

    const isATSlotCorner: IsATSlotCornerMap = {
      a: rightOf3 !== '[_]',
      b: leftOf3 !== '[_]',
      c: up1From2 !== '[_]',
      d: up1From0 !== '[_]'
    }

    return isATSlotCorner
  }

  static getTSlotCorners_west(tetriminoCoordsOnPlayfield: Coordinates[], playfield: string[][]) {
    const mino0 = tetriminoCoordsOnPlayfield[0]
    const mino3 = tetriminoCoordsOnPlayfield[3]

    const rightOf0 = playfield[mino0[0]][mino0[1] + 1]
    const rightOf3 = playfield[mino3[0]][mino3[1] + 1]
    const leftOf0 = playfield[mino0[0]][mino0[1] - 1]
    const leftOf3 = playfield[mino3[0]][mino3[1] - 1]

    const isATSlotCorner: IsATSlotCornerMap = {
      a: leftOf3 !== '[_]', 
      b: leftOf0 !== '[_]',
      c: rightOf3 !== '[_]',
      d: rightOf0 !== '[_]' 
    }

    return isATSlotCorner
  }


  static getTSpinType(newOrientation: string, tetriminoCoordsOnPlayfield: Coordinates[], playfield: string[][]) {
    const tSlotCorners = TSpinCalculator.tSlotCornersGetters[`getTSlotCorners_${newOrientation}` as keyof TSlotCornersGettersMap](tetriminoCoordsOnPlayfield, playfield)
    
    let performedTSpin = false
    let performedTSpinMini = false
    
    const aAndBAreTSlotCorners = tSlotCorners.a && tSlotCorners.b
    const cAndDAreTSlotCorners = tSlotCorners.c && tSlotCorners.d

    // Check for a T-Spin
    if (aAndBAreTSlotCorners && tSlotCorners.c || aAndBAreTSlotCorners && tSlotCorners.d) {
      performedTSpin = true
    }
    // Check for a mini T-Spin
    if (cAndDAreTSlotCorners && tSlotCorners.a || aAndBAreTSlotCorners && tSlotCorners.b) {
      performedTSpinMini = true
    }

    return {
      performedTSpin,
      performedTSpinMini
    }

  }
}