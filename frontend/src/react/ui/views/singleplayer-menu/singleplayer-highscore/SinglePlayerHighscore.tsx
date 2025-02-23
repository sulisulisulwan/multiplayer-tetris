import * as React from 'react'

import MenuOptionWrapper from '../../../sharedComponents/MenuOptionWrapper'
import { useDispatch } from 'react-redux'
import { setView } from 'multiplayer-tetris-redux'


//TODO:  We should be able to cycle through different high score tables for each game variation

const mockData = [
  { name: 'Ignatius', score: 2345345 },
  { name: 'Compitello', score: 345345 },
  { name: 'DFA', score: 34555 },
  { name: 'PooBros', score: 5453 },
  { name: 'Hana', score: 4354 },
  { name: 'Suli', score: 3424 },
  { name: 'Sami', score: 3421 },
  { name: 'Caeli', score: 3242 },
  { name: 'Laura', score: 1233 },
  { name: 'Someon1', score: 1212 },
  { name: 'Some2', score: 121 }
]

const SinglePlayerHighScore = () => {
  const dispatch = useDispatch()

  return(
    <MenuOptionWrapper
      clsName="singleplayer-highschore-view"
      optionTitle=''
      onBackButtonClick={() => { 
        dispatch(setView('menu_singleplayer'))
      }}
    >
      <div 
        style={{ 
          color: 'white',
          fontFamily: 'Exo',
          height: '100%'
        }}
      >
        <div>
          <h1 style={{ textAlign: 'center' }}>SINGLEPLAYER HIGH SCORE</h1>
          <div>There should be tabs here to toggle between different game modes</div>
          {/* <SingleplayerGameTypeTabs selectedGameMode={selectedGameMode} setSelectedGameMode={setSelectedGameMode}/> */}
        </div>
        <table
          style={{
            margin: '0 auto',
            borderCollapse: 'collapse',
            minWidth: 400,
            textAlign: 'center',
            fontFamily: 'Exo',
            fontSize: 20,
            border: '3px solid black'
          }}
        >
          <tbody>
            {
              mockData.map((highScore, i) => {
                return (
                  <tr 
                    key={`${i}-${highScore.name}-${highScore.score}`}
                    style={{
                      color: 'white',
                      fontFamily: 'Exo',
                      border: 'solid 1px white'
                    }}
                    >
                    <td
                      style={{
                        padding: 10,
                        border: 'solid 1px white'
                      }}
                      >{highScore.name}</td>
                    <td
                      style={{
                        padding: 10,
                        border: 'solid 1px white'
                      }}
                    >{highScore.score}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </MenuOptionWrapper>
  ) 
}


export default SinglePlayerHighScore