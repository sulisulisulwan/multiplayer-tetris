import { SoundEffects as SoundEffectsAbstract } from "multiplayer-tetris-types"
import Audio from "./Audio.js"


type SoundLoaderData = {
  src: string
  name: string
}

type SoundData = {
  src: string
  audioTag: HTMLAudioElement
}

export default class SoundEffects extends Audio implements SoundEffectsAbstract {

  protected sounds: Record<string, SoundData>
  protected mountId: string

  constructor(sounds: SoundLoaderData[], mountId: string) {
    super(sounds, mountId)
  }

  public play(soundName: string) {
    this.sounds[soundName].audioTag.currentTime = 0
    this.sounds[soundName].audioTag.play()
  }

  protected loadSounds(effects: SoundLoaderData[]): Record<string, SoundData> {
    return effects
      .filter(effectData => {
        return effectData.src !== null
      })
      .reduce((allEffects, curr) => {
        const audioTag = document.createElement('audio')
        audioTag.setAttribute('src', curr.src)

        allEffects[curr.name as keyof Record<string, SoundData>] = {
          src: curr.src,
          audioTag
        }
        return allEffects
     }, {} as Record<string, SoundData>)
  }


  
}
