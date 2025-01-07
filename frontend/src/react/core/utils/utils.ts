import { coordinates, genericObjectIF } from "../../types"

const makeCopy = (objOrArray: object) => {

  if (Array.isArray(objOrArray)) {
    const obj: genericObjectIF = {} 

    objOrArray.forEach((row: string[], i: number) => {
      obj[i as keyof genericObjectIF] = {}
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

const offsetCoordsToLineBelow = (currentCoords: coordinates[]) => {
  return currentCoords.map((coord: coordinates) => {
    return [coord[0] + 1, coord[1]]
  })
}

export {
  offsetCoordsToLineBelow,
  makeCopy
}