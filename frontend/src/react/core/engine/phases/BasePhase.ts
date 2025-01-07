import { SharedScope } from "../../SharedScope"
import { sharedHandlersIF } from "../../../types"

export default abstract class BasePhase extends SharedScope {
  
  constructor(sharedHandlers: sharedHandlersIF) {
    super(sharedHandlers)
  }

  public abstract execute(): void

}