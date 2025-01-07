import { patternItemIF, appStateIF } from "../../../../../types"

export default function lineClear(): patternItemIF | null {
  const rowsToClear: number[] = []
  const { playfield } = this.appState as appStateIF

  playfield.forEach((row, index) => {
    if (row.every(square => square !== '[_]')) {
      rowsToClear.push(index)
    }
  })

  let lineClearPatternItem: patternItemIF | null = null

  if (rowsToClear.length) {
    lineClearPatternItem = {
      type: 'lineClear',
      action: 'eliminate',
      stateUpdate: [
        {
          field: 'totalLinesCleared',
          value: rowsToClear.length + this.appState.totalLinesCleared
        }
      ],
      data: {
        linesCleared: rowsToClear.length,
        rowsToClear: rowsToClear
      }
    }  
  }

  return lineClearPatternItem
}