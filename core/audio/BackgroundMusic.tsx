import Audio from "./Audio"
import { BackgroundMusic as BackgroundMusicAbstract } from "multiplayer-tetris-types/frontend/core"

type SoundLoaderData = {
  src: string
  name: string
  loopTimestamp: number
}

type SoundData = {
  src: string
  audioTag: HTMLAudioElement
  loopTimestamp: number
}

export default class BackgroundMusic extends Audio implements BackgroundMusicAbstract {

  protected sounds: Record<string, SoundData>
  protected mountId: string
  protected currTrack: string

  constructor(sounds: SoundLoaderData[], mountId: string) {
    super(sounds, mountId)
    this.sounds = this.loadSounds(sounds)
    this.mountId = mountId
    this.currTrack = null
  }

  public play() {
    if (this.currTrack === null) return
    
    const backgroundMusic = this.sounds[this.currTrack]
    const audioTag = backgroundMusic.audioTag
    audioTag.addEventListener('ended', function () {
      audioTag.currentTime = backgroundMusic.loopTimestamp
      audioTag.play()
    })
    audioTag.play()
  }

  public setTrack(trackName: string) {
    if (this.currTrack) {
      this.sounds[this.currTrack].audioTag.pause()
      this.sounds[this.currTrack].audioTag.currentTime = 0
    }

    if (!this.sounds[trackName]) return 

    this.currTrack = trackName
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
          audioTag,
          loopTimestamp: curr.loopTimestamp
        }
        return allEffects
     }, {} as Record<string, SoundData>)
  }
  
}

