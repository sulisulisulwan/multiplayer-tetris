import { GenericObject, LineClearPatternDataItem, OnePlayerLocalGameState, PatternDataItem, ScoreItem } from "multiplayer-tetris-types"

export default class ScoreItemFactory {

  /**
   * Organizes data currently held in state and data computed between state changes into an item for
   * consumption by the scoring handlers.
   */

  private scoreItemDataMap: Map<string, any>

  constructor() {
    this.scoreItemDataMap = new Map([
      ['lineClear', this.buildLineClearData.bind(this)],
      ['softdrop', this.buildSoftdropData.bind(this)],
      ['harddrop', this.buildHarddropData.bind(this)],
      ['tSpinNoLineClear', this.buildTSpinNoLineClear.bind(this)],
      ['tSpinMiniNoLineClear', this.buildTSpinMiniNoLineClear.bind(this)]
    ]) 
  }

  public getItem(type: string, gameState: OnePlayerLocalGameState, nonStateData?: PatternDataItem | null) {

    const scoreItemDataBuilder = this.scoreItemDataMap.get(type)

    const scoreItem: ScoreItem= {
      type,
      data: scoreItemDataBuilder(gameState, nonStateData)
    }

    return scoreItem
  }

  private buildLineClearData(gameState: OnePlayerLocalGameState, patternData: LineClearPatternDataItem) {
    const { performedTSpinMini, performedTSpin } = gameState
    const linesCleared = patternData.linesCleared
    const backToBackCondition1 = linesCleared === 4 || (performedTSpin || performedTSpinMini) ? true : false
    const backToBackCondition2 = gameState.backToBack
    const backToBack = backToBackCondition1 && backToBackCondition2
    return { 
      linesCleared,
      backToBack,
      currentLevel: gameState.currentLevel,
      performedTSpin: gameState.performedTSpin,
      performedTSpinMini: gameState.performedTSpinMini,
    }

  }

  private buildSoftdropData(gameState: OnePlayerLocalGameState) {
    return { 
      currentScore: gameState.totalScore 
    }
  }

  private buildHarddropData(gameState: OnePlayerLocalGameState, data: GenericObject) {
    return { 
      currentScore: gameState.totalScore,
      linesDropped: data.linesDropped
    }
  }

  private buildTSpinNoLineClear(gameState: OnePlayerLocalGameState) {
    return { 
      currentScore: gameState.totalScore,
      currentLevel: gameState.currentLevel
    }
  }

  private buildTSpinMiniNoLineClear(gameState: OnePlayerLocalGameState) {
    return { 
      currentScore: gameState.totalScore,
      currentLevel: gameState.currentLevel
    }
  }

}