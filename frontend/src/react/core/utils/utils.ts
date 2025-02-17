import { Coordinates, GenericObject } from "multiplayer-tetris-types/frontend"

const makeCopy = (objOrArray: object) => {

  if (Array.isArray(objOrArray)) {
    const obj: GenericObject = {} 

    objOrArray.forEach((row: string[], i: number) => {
      obj[i as keyof GenericObject] = {}
      row.forEach((square: string, j: number) => {
        obj[i][j] = square
      })
    })

    const stringified = JSON.stringify(objOrArray)
    const parsed = JSON.parse(stringified)

    const newArray = new Array(40)

    for (const row in parsed) {
      const rowAsNum = +row
      newArray[rowAsNum] = []
      for (const square in parsed[row]) {
        newArray[rowAsNum][+square] = parsed[row][square]
      }
    }

    return newArray

  }

  const stringified = JSON.stringify(objOrArray)
  const parsed = JSON.parse(stringified)
  return parsed
  // return JSON.parse(JSON.stringify(objOrArray))
}

const offsetCoordsToLineBelow = (currentCoords: Coordinates[]) => {
  return currentCoords.map((coord: Coordinates) => {
    return [coord[0] + 1, coord[1]]
  })
}

export {
  offsetCoordsToLineBelow,
  makeCopy
}