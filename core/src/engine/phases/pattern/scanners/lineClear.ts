import { AppState, OnePlayerLocalGameState, PatternItem } from "multiplayer-tetris-types"

export default function lineClear(gameState: OnePlayerLocalGameState): PatternItem | null {
  const rowsToClear: number[] = []
  const { playfield } = gameState;


  (playfield as string[][]).forEach((row, index) => {
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
          value: rowsToClear.length + gameState.totalLinesCleared
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