import { GenericObject } from "multiplayer-tetris-types/frontend";

export class TSpinMiniNoLineClearAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    const { currentLevel } = scoringData
    const tSpinMiniAward =  100 * currentLevel
    return currentScore + tSpinMiniAward
  }
}