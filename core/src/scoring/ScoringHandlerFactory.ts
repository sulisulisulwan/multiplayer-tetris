import { ClassicScoringHandler } from './modes/ClassicScoringHandler.js'

export class ScoringHandlerFactory {

  public static loadScoringHandler(scoringMode: string) {
    const loadScoringHandlerMap = new Map([
      ['classic', ClassicScoringHandler ]
    ])

    const ctor = loadScoringHandlerMap.get(scoringMode)
    return new ctor()
  }

}
