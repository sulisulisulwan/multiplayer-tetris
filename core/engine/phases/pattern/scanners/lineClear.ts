import { AppState, PatternItem } from "multiplayer-tetris-types/frontend"

export default function lineClear(gameState: AppState['gameState']): PatternItem | null {
  const rowsToClear: number[] = []
  const { playfield } = gameState

  playfield.forEach((row, index) => {
    if (row.every(square => square !== '[_]')) {
      rowsToClear.push(index)
    }
  })

  let lineClearPatternItem: PatternItem | null = null

  if (rowsToClear.length) {
    lineClearPatternItem = {
      type: 'lineClear',
      action: 'eliminate',
      stateUpdate: [
        {
          field: 'totalLinesCleared',
          value: rowsToClear.length + this.appState.gameState.totalLinesCleared
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