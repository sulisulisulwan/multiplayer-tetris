import * as React from 'react'

import MultiOptionField from '../../../sharedComponents/MultiOptionField'
import RangeField from '../../../sharedComponents/RangeField'
import ToggleField from '../../../sharedComponents/ToggleField'
import MenuOptionWrapper from '../../../sharedComponents/MenuOptionWrapper'
import RangeSliderField from '../../../sharedComponents/RangeSliderField'
import { SingleplayerOptions } from 'multiplayer-tetris-types'
import { Dispatch } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { getGameOptions, setView, updateGameOptionFieldValue, updateRangeValue, updateToggleField, updateVolume } from 'multiplayer-tetris-redux'

const lockModes = ['extended', 'classic', 'infinite']
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


const SinglePlayerOptions = () => {

  const dispatch = useDispatch()
  const gameOptions = useSelector(getGameOptions)

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

  return (
    <MenuOptionWrapper
      clsName="options-menu"
      optionTitle='OPTIONS MENU'
      onBackButtonClick={() => {
        dispatch(setView('menu_singleplayer'))
      }}
    >
      <div style={optionCategoryStyle}>GAME VARIATION</div>
      <table style={optionTableStyle}>
        <tbody>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>STARTING LEVEL</td>
            <td style={optionSettingStyle}>
              <RangeField
                dispatch={dispatch}
                onClickRangeHandler={onClickRangeWrapper}
                currentValue={gameOptions.singleplayer.startingLevel as number}
                options={{ min: 1, max: 15, stateField: 'startingLevel' }}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>GHOST PIECE</td>
            <td style={optionSettingStyle}>
              <ToggleField
                dispatch={dispatch}
                onClickToggleHandler={onClickToggleHandler}
                currentValue={gameOptions.singleplayer.ghostTetriminoOn}
                options={{ stateField: 'ghostTetriminoOn' }}
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
                dispatch={dispatch}
                onClickRangeHandler={onClickRangeWrapper}
                currentValue={gameOptions.singleplayer.nextQueueSize}
                options={{ min: 1, max: 6, stateField: 'nextQueueSize' }}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>HOLD QUEUE</td>
            <td style={optionSettingStyle}>
              <ToggleField
                dispatch={dispatch}
                onClickToggleHandler={onClickToggleHandler}
                currentValue={gameOptions.singleplayer.holdQueueAvailable}
                options={{ stateField: 'holdQueueAvailable' }}
              />
            </td>
          </tr>
          <tr style={optionRowStyle}>
            <td style={optionNameStyle}>LOCK DOWN MODE</td>
            <td style={optionSettingStyle}>
              <MultiOptionField
                dispatch={dispatch}
                onClickMultiOptionHandler={onClickMultiOptionHandler}
                currentValue={gameOptions.singleplayer.lockMode}
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
                dispatch={dispatch}
                onClickMultiOptionHandler={onClickMultiOptionHandler}
                currentValue={gameOptions.singleplayer.backgroundMusic}
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
                dispatch={dispatch}
                currValue={gameOptions.singleplayer.volume.soundeffects}
                onChangeRangeHandler={onChangeRangeSliderHandler}
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
                dispatch={dispatch}
                currValue={gameOptions.singleplayer.volume.music}
                onChangeRangeHandler={onChangeRangeSliderHandler}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={optionCategoryStyle}>KEY CONFIGURATIONS</div>
    </MenuOptionWrapper>
  )
}

const onChangeRangeSliderHandler = (
  dispatch: Dispatch,
  stateField: string,
  newValue: number,
  min: number,
  max: number
) => {
  if (newValue < min || newValue > max) return
  dispatch(updateVolume({ gameType: 'singleplayer', volumeField: stateField, newValue }))

}

const onClickRangeWrapper = (
  dispatch: Dispatch, 
  min: number, 
  max: number, 
  actionSymbol: string, 
  stateField: string
) => {
  
  dispatch(updateRangeValue({ gameType: 'singleplayer', stateField, min, max, actionSymbol }))
}

const onClickToggleHandler = (dispatch: Dispatch, stateField: string) => {
  dispatch(updateToggleField({ gameType: 'singleplayer', stateField }))
}

const onClickMultiOptionHandler = (
  dispatch: Dispatch,
  stateField: string,
  optionsArray: any[],
  newIdx: number
) => {
  const newValue = optionsArray[newIdx]
  dispatch(updateGameOptionFieldValue({ gameType: 'singleplayer', stateField, newValue }))

}

export default SinglePlayerOptions