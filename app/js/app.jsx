import React from 'react'
import ReactDOM from 'react-dom'
import * as R from 'ramda'
import {
  connect,
  StateProvider
} from './xs-state.jsx'
import { state$ } from './state'
import {
  playerNameChange,
  playerFactionChange,
  createPlayerAccount,
  foundColony,
  useGenesis
} from './actions'
import { confirmTx } from './eth-utils'
import {
  HeaderBar,
  Meadow,
  Scoreboard,
  MultiView,
  Registration,
  Founding,
  PlayerColony
} from './components'

// TODO: Map actually used properties
const ConnectedHeaderBar = connect(HeaderBar)(R.identity)
const ConnectedMeadow = connect(Meadow)(R.merge)
const ConnectedScoreboard = connect(Scoreboard)(R.identity)
const ConnectedMultiView = connect(MultiView)(R.merge)
const ConnectedRegistration = connect(Registration)(R.merge)
const ConnectedFounding = connect(Founding)(R.merge)

const App = props => (
  <div className="vertical">
    <ConnectedHeaderBar/>
    <div className="horizontal">
      <div className="vertical" >
        <ConnectedMeadow
          foundColony={foundColony}
          useGenesis={useGenesis}/>
      </div>
      <div className="vertical">
        <ConnectedScoreboard/>
        <ConnectedMultiView
          onNameChange={playerNameChange}
          createPlayerAccount={createPlayerAccount}
          onFactionChange={playerFactionChange}/>
      </div>
    </div>
  </div>
)

ReactDOM.render(
  <StateProvider state$={state$}>
    <App/>
  </StateProvider>,
  document.getElementById('app'))
