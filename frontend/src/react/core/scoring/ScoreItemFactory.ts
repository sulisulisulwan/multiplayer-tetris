import { appStateIF, genericObjectIF, lineClearPatternDataIF, patternDataIF, patternItemIF, scoreItemIF, sharedHandlersIF } from "../../types"

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

  public getItem(type: string, stateData: appStateIF, nonStateData: patternDataIF | null) {

    const scoreItemDataBuilder = this.scoreItemDataMap.get(type)

    const scoreItem: scoreItemIF= {
      type,
      data: scoreItemDataBuilder(stateData, nonStateData)
    }

    return scoreItem
  }

  private buildLineClearData(stateData: appStateIF, patternData: lineClearPatternDataIF) {
    const { performedTSpinMini, performedTSpin } = stateData
    const linesCleared = patternData.linesCleared
    const backToBackCondition1 = linesCleared === 4 || (performedTSpin || performedTSpinMini) ? true : false
    const backToBackCondition2 = stateData.backToBack
    const backToBack = backToBackCondition1 && backToBackCondition2
    return { 
      linesCleared,
      backToBack,
      currentLevel: stateData.currentLevel,
      performedTSpin: stateData.performedTSpin,
      performedTSpinMini: stateData.performedTSpinMini,
    }

  }

  private buildSoftdropData(stateData: appStateIF) {
    return { 
      currentScore: stateData.totalScore 
    }
  }

  private buildHarddropData(stateData: appStateIF, data: genericObjectIF) {
    return { 
      currentScore: stateData.totalScore,
      linesDropped: data.linesDropped
    }
  }

  private buildTSpinNoLineClear(stateData: appStateIF) {
    return { 
      currentScore: stateData.totalScore,
      currentLevel: stateData.currentLevel
    }
  }

  private buildTSpinMiniNoLineClear(stateData: appStateIF) {
    return { 
      currentScore: stateData.totalScore,
      currentLevel: stateData.currentLevel
    }
  }

}