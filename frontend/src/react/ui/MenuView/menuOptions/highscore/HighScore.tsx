import * as React from 'react'

import { appStateIF, setAppStateIF } from '../../../../types'
import MenuOptionWrapper from '../../MenuOptionWrapper'

interface highScorePropsIF {
  appState: appStateIF
  setAppState: setAppStateIF
}

interface highScoreDataIF {
  name: string
  score?: number
  level?: number
  goalAttained?: number
}

//TODO:  We should be able to cycle through different high score tables for each game variation

class HighScore extends React.Component<highScorePropsIF> {

  private mockData: highScoreDataIF[] | null

  constructor(props: highScorePropsIF) {
    super(props)
    this.mockData = [
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
  }

  render() {

    const { setAppState, appState } = this.props

    return(
      <MenuOptionWrapper
        clsName="highschore-view"
        optionTitle='HIGH SCORE'
        backToView='mainMenu'
        setAppState={setAppState}
      >
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
          {
            this?.mockData?.map((highScore, i) => {
              return (
                <tr 
                  key={`${i}-${highScore.name}-${highScore.score}`}
                  style={{
                    border: 'solid 1px black'
                  }}
                  >
                  <td
                    style={{
                      padding: 10,
                      border: 'solid 1px black'
                    }}
                    >{highScore.name}</td>
                  <td
                    style={{
                      padding: 10,
                      border: 'solid 1px black'
                    }}
                  >{highScore.score}</td>
                </tr>
              )
            })
          }
        </table>

      </MenuOptionWrapper>
    )
  }
}

export default HighScore