import { GenericObject } from "multiplayer-tetris-types";
import { BaseAward } from "./BaseAward.js";

export class HarddropAward extends BaseAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    const { linesDropped } = scoringData
    return currentScore + (linesDropped * 2)
  }
}