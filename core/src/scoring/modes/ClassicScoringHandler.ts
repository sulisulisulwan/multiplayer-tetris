import { BaseScoringHandler as BaseScoringHandlerAbstract, GenericObject, ScoreItem, ScoringHistoryPerCycle, ScoringMethods } from "multiplayer-tetris-types"
import { 
  LineClearAward,
  SoftdropAward,
  HarddropAward,
  TSpinMiniNoLineClearAward,
  TSpinNoLineClearAward
} from '../awards/index.js'

export class ClassicScoringHandler extends BaseScoringHandlerAbstract {

  private awardLineClear: LineClearAward
  private awardSoftdrop: SoftdropAward
  private awardHarddrop: HarddropAward
  private awardTSpinNoLineClear: TSpinNoLineClearAward
  private awardTSpinMiniNoLineClear: TSpinMiniNoLineClearAward
  protected scoringMethods: ScoringMethods

  constructor() {
    super()

    this.awardLineClear = new LineClearAward()
    this.awardSoftdrop = new SoftdropAward()
    this.awardHarddrop = new HarddropAward()
    this.awardTSpinNoLineClear = new TSpinNoLineClearAward()
    this.awardTSpinMiniNoLineClear = new TSpinMiniNoLineClearAward()

    this.scoringMethods = {
      lineClear: this.lineClear.bind(this),
      softdrop: this.softdrop.bind(this),
      harddrop: this.harddrop.bind(this),
      tSpinNoLineClear: this.tSpinNoLineClear.bind(this),
      tSpinMiniNoLineClear: this.tSpinMiniNoLineClear.bind(this)
    }
    
  } 

  public updateScore(currentScore: number, scoreItem: ScoreItem) {
    const { type, data } = scoreItem
    const scoringMethod = this.scoringMethods[type as keyof ScoringMethods]
    return scoringMethod(currentScore, data)
  }

  public handleCompletionPhaseAccrual(
    currentScore: number, 
    scoreItemsForCompletion: ScoreItem[], 
    scoringHistoryPerCycle: ScoringHistoryPerCycle
  ): number {

    const filteredScoringContexts = scoreItemsForCompletion.filter((scoreItem: ScoreItem) => {
      const { type } = scoreItem

      if (type === 'tSpinNoLineClear' || type === 'tSpinMiniNoLineClear') {
        // skip this context as lineClear is the priority
        return scoringHistoryPerCycle.lineClear ? false : true
      }
      return true

    })

    const newTotalScore = filteredScoringContexts.reduce((runningScore: number, scoreItem: ScoreItem) => {
      return this.updateScore(runningScore, scoreItem)
    }, currentScore)

    return newTotalScore

  }

  // Executed within PlayerAction or Falling Phase
  protected softdrop(currentScore: number, scoringData: GenericObject) {
    const newTotalScore = this.awardSoftdrop.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  protected harddrop(currentScore: number, scoringData: GenericObject) {
    const newTotalScore = this.awardHarddrop.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  // Executed in Completion Phase
  protected lineClear(currentScore: number, scoringData: GenericObject) {
    const newTotalScore = this.awardLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }

  protected tSpinNoLineClear(currentScore: number, scoringData: GenericObject) {
    const newTotalScore = this.awardTSpinNoLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore
  }
  
  protected tSpinMiniNoLineClear(currentScore: number, scoringData: GenericObject) {
    const newTotalScore = this.awardTSpinMiniNoLineClear.calculateScore(currentScore, scoringData)
    return newTotalScore  
  }

}
