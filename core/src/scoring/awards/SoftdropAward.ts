import { GenericObject } from "multiplayer-tetris-types";

export class SoftdropAward {
  public calculateScore(currentScore: number, scoringData: GenericObject): number {
    return currentScore + 1
  }
}