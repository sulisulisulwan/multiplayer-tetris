import * as React from 'react'

import { appStateIF, setAppStateIF, singleplayerOptionsIF } from '../../../../types'
import MultiOptionField from '../../../sharedComponents/MultiOptionField'
import RangeField from '../../../sharedComponents/RangeField'
import ToggleField from '../../../sharedComponents/ToggleField'
import MenuOptionWrapper from '../../MenuOptionWrapper'
import RangeSliderField from '../../../sharedComponents/RangeSliderField'

interface optionsPropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

const lockModes =  ['extended','classic', 'infinite']
const songs = [
  'Korobeiniki', 
  'CrossCode: Raid', 
  'Chrome Gadget',
  'Death Egg',
  'Ice Cap',
  'Let\s Go!',
  'Zombie Attack',
  'Random',
  'None'
]


const Options = ({ appState, setAppState }: optionsPropsIF) => {


  const gameOptions: singleplayerOptionsIF = appState.gameOptions as singleplayerOptionsIF

  const optionCategoryStyle: React.CSSProperties = {
    color: 'white',
    padding: 30,
    textAlign: 'center',
    fontFamily: 'Exo',
    fontWeight: 900,
    fontSize: 20,
  }

  const optionTableStyle: React.CSSProperties = {
    color: 'white',
    margin: '0 auto',
    textAlign: 'center',
    listStyle: 'none',
    padding: 0
  }

  const optionRowStyle: React.CSSProperties = {}

  const optionNameStyle: React.CSSProperties = {
    color: 'white',
    fontFamily: 'Andale mono',
    minWidth: 235,
    textAlign: 'left',
    padding: 5
  }
  
  const optionSettingStyle: React.CSSProperties = {
    minWidth: 235,
  }

  return(
    <MenuOptionWrapper
      clsName="options-menu"
      optionTitle='OPTIONS MENU'
      onBackButtonClick={() => { 
        setAppState((currentState: any) => { 
          return { ...currentState, view: 'singleplayer' }
        }) 
      }}
    >
      <div style={optionCategoryStyle}>GAME VARIATION</div>
      <table style={optionTableStyle}>
        <tbody>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>STARTING LEVEL</td>
            <td style={optionSettingStyle}>
              <RangeField
                appState={appState}
                setAppState={setAppState}
                onClickRangeHandler={onClickRangeWrapper}
                currentValue={gameOptions.startingLevel as number}
                options={{ min: 1, max: 15, context: null, stateField: 'startingLevel'}}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>GHOST PIECE</td>
            <td style={optionSettingStyle}>
              <ToggleField
                appState={appState}
                setAppState={setAppState}
                onClickToggleHandler={onClickToggleHandler}
                currentValue={gameOptions.ghostTetriminoOn}
                options={{ stateField: 'ghostTetriminoOn'}}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>STARTING LINES</td>
            <td style={optionSettingStyle}>Move to game modes?</td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>NEXT QUEUE SIZE</td>
            <td style={optionSettingStyle}>
              <RangeField
                appState={appState}
                setAppState={setAppState}
                onClickRangeHandler={onClickRangeWrapper}
                currentValue={gameOptions.nextQueueSize}
                options={{ min: 1, max: 6, context: null, stateField: 'nextQueueSize' }}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>HOLD QUEUE</td>
            <td style={optionSettingStyle}>
              <ToggleField
                appState={appState}
                setAppState={setAppState}
                onClickToggleHandler={onClickToggleHandler}
                currentValue={gameOptions.holdQueueAvailable}
                options={{ stateField: 'holdQueueAvailable'}}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>LOCK DOWN MODE</td>
            <td style={optionSettingStyle}>
              <MultiOptionField
                onClickMultiOptionHandler={onClickMultiOptionHandler}
                currentValue={gameOptions.lockMode}
                setAppState={setAppState}
                stateField={'lockMode'}
                optionsArray={lockModes}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={optionCategoryStyle}>BACKGROUND MUSIC</div>
      <table style={optionTableStyle}>
        <tbody>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>SONG</td>
            <td style={optionSettingStyle}>
              <MultiOptionField
                onClickMultiOptionHandler={onClickMultiOptionHandler}
                currentValue={gameOptions.backgroundMusic}
                setAppState={setAppState}
                stateField={'backgroundMusic'}
                optionsArray={songs}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={optionCategoryStyle}>VOLUME</div>
      <table style={optionTableStyle}>
        <tbody>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>SOUND EFFECTS</td>
            <td style={optionSettingStyle}>
              <RangeSliderField
                min={0}
                max={100}
                stateField={'soundeffects'}
                currValue={gameOptions.volume.soundeffects}
                onChangeRangeHandler={onChangeRangeSliderHandler}
                appState={appState}
                setAppState={setAppState}
                />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>MUSIC</td>
            <td>
              <RangeSliderField
                min={0}
                max={100}
                stateField={'music'}
                currValue={gameOptions.volume.music}
                onChangeRangeHandler={onChangeRangeSliderHandler}
                appState={appState}
                setAppState={setAppState}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={optionCategoryStyle}>KEY CONFIGURATIONS</div>
    </MenuOptionWrapper>
  )
}

const onChangeRangeSliderHandler = ({ appState, setAppState, volumeField, newValue, min, max}: {
  appState: appStateIF,
  setAppState: setAppStateIF
  volumeField: string,
  newValue: number,
  min: number,
  max: number
}) => {

  if (newValue < min || newValue > max) return

  const newState: any = {
    ...appState,
    gameOptions: {
      ...appState.gameOptions,
      volume: {
        ...(appState.gameOptions as any).volume,
        [volumeField]: newValue
      } 
    }
  }

  setAppState(newState)
}

const onClickRangeWrapper = (appState: appStateIF, setAppState: setAppStateIF, options: any) => {

  const { min, max, context, stateField } = options

  let oldState =  (appState.gameOptions as singleplayerOptionsIF)[stateField as keyof singleplayerOptionsIF] as number

  if (context === '+' && oldState < max) {
    oldState += 1
  } else if (context === '-' && oldState > min) {
    oldState -= 1
  }

  const newState = oldState
  setAppState((prevState) => { 
    return { 
      ...prevState, 
      gameOptions: {
        ...prevState.gameOptions,
        [stateField]: newState 
      }
    }
  })
}

const onClickToggleHandler = (appState: appStateIF, setAppState: setAppStateIF, options: any) => {
  const { stateField } = options
  const newState = !(appState.gameOptions as singleplayerOptionsIF)[stateField as keyof singleplayerOptionsIF]
  setAppState((prevState) => { 
    return { 
      ...prevState, 
      gameOptions: {
        ...appState.gameOptions as singleplayerOptionsIF,
        [stateField]: newState 
      }
    }
  })
}

const onClickMultiOptionHandler = (
  setAppState: setAppStateIF, 
  stateField: string, 
  optionsArray: any[], 
  newIdx: number
) => {

  const newValue = optionsArray[newIdx]

  setAppState((prevState) => { 
    return { 
      ...prevState, 
      gameOptions: {
        ...prevState.gameOptions as singleplayerOptionsIF,
        [stateField]: newValue 
      }
    }
  })
}

export default Options