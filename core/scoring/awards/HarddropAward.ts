import { GenericObject } from "multiplayer-tetris-types/frontend";
import { BaseAward } from "./BaseAward";

export class HarddropAward extends BaseAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }
}