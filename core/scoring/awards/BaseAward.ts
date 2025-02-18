import { GenericObject } from "multiplayer-tetris-types/frontend";

export abstract class BaseAward {
  public abstract calculateScore(currentScore: number, scoringData: GenericObject): number
}