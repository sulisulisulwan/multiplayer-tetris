import { lineClearPatternDataIF } from "../../../../../types"

export default function lineClearEliminator(playfield: string[][], patternData: lineClearPatternDataIF ): string[][] {

  const filteredPlayfield = playfield.filter((row, index) => {
    const isTargetRow = patternData.rowsToClear.includes(index) 
    return !isTargetRow
  })

  let newRows = new Array(40 - filteredPlayfield.length).fill(null)
  newRows = newRows.map(row => new Array(10).fill('[_]', 0, 10))
  const newPlayfield = newRows.concat(filteredPlayfield)
  this.soundEffects.play('lineClear')
  return newPlayfield
}