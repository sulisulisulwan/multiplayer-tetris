import BaseAudio from "./BaseAudio"

type soundLoaderData = {
  src: string
  name: string
}

type soundData = {
  src: string
  audioTag: HTMLAudioElement
}

export default class SoundEffects extends BaseAudio {

  protected sounds: Record<string, soundData>
  protected mountId: string

  constructor(sounds: soundLoaderData[], mountId: string) {
    super(sounds, mountId)
    this.sounds = this.loadSounds(sounds)
    this.mountId = mountId
  }

  public play(soundName: string) {
    this.sounds[soundName].audioTag.currentTime = 0
    this.sounds[soundName].audioTag.play()
  }

  protected loadSounds(effects: soundLoaderData[]): Record<string, soundData> {
    return effects
      .filter(effectData => {
        return effectData.src !== null
      })
      .reduce((allEffects, curr) => {
        const audioTag = document.createElement('audio')
        audioTag.setAttribute('src', curr.src)

        allEffects[curr.name as keyof Record<string, soundData>] = {
          src: curr.src,
          audioTag
        }
        return allEffects
     }, {} as Record<string, soundData>)
  }


  
}
