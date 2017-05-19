import * as L from 'partial.lenses'
import {
  blockId$,
  playerAccount$,
  playerColony$,
  round$,
  count$,
  cells$,
  factions$,
  colonies$
} from './streams'
import {
  replaceState,
  effectReducer,
  scopeReducer,
  combineReducers,
  createState
} from './xs-state.jsx'
import {
  playerNameChange,
  playerFactionChange,
  createPlayerAccount,
  foundColony,
  useGenesis
} from './actions'
import {
  confirmTx
} from './eth-utils'

const playerNameReducer = playerNameChange.$.map(replaceState)

const playerFactionReducer = playerFactionChange.$.map(replaceState)

const playerAccountReducer = playerAccount$.map(replaceState)

const playerColonyReducer = playerColony$.map(replaceState)

const roundReducer = round$.map(replaceState)

const factionsReducer = factions$.map(replaceState)

const countReducer = count$.map(replaceState)

const cellsReducer = cells$.map(replaceState)

const coloniesReducer = colonies$.map(replaceState)

const useGas = estimate =>
  Math.floor(1.5 * estimate)

const createPlayerAccountReducer = effectReducer(createPlayerAccount, playerName => {
  // eslint-disable-next-line
  console.log(`Create account for ${playerName}`)
  confirmTx(zodigol.registerAsPlayer.estimateGas(playerName).then(estimate => {
    return zodigol.registerAsPlayer(playerName, {
      from: window.account,
      gas: useGas(estimate)
    })
  })).then(() => {
    // eslint-disable-next-line
    console.log(`Created account for ${playerName}`)
  }).catch(() => {
    // eslint-disable-next-line
    console.error(`Failed to create account for ${playerName}`)
  })
})

const foundColonyReducer = effectReducer(foundColony, ([faction, cells]) => {
  // eslint-disable-next-line
  console.log(`Found colony faction ${faction} at ${cells}`)
  confirmTx(zodigol.foundColony.estimateGas(faction, cells).then(estimate => {
    return zodigol.foundColony(faction, cells, {
      from: window.account,
      gas: useGas(estimate)
    })
  })).then(() => {
    // eslint-disable-next-line
    console.log(`Founded colony faction ${faction} at ${cells}`)
  }).catch(() => {
    // eslint-disable-next-line
    console.error(`Failed to found colony faction ${faction} at ${cells}`)
  })
})

const useGenesisReducer = effectReducer(useGenesis, index => {
  // eslint-disable-next-line
  console.log(`Use genesis at ${index}`)
  confirmTx(zodigol.useGenesis.estimateGas(index).then(estimate => {
    return zodigol.useGenesis(index, {
      from: window.account,
      gas: useGas(estimate)
    })
  })).then(() => {
    // eslint-disable-next-line
    console.log(`Used genesis at ${index}`)
  }).catch(() => {
    // eslint-disable-next-line
    console.error(`Failed to use genesis at ${index}`)
  })
})

export const initialState = {
  playerName: '',
  playerFaction: 0,
  playerAccount: undefined,
  playerColony: undefined,
  currentRound: undefined,
  activeFactions: [],
  cellCount: 0,
  liveCells: [],
  colonies: []
}

export const reducer = combineReducers([
  scopeReducer(playerNameReducer, L.prop('playerName')),
  scopeReducer(playerFactionReducer, L.prop('playerFaction')),
  scopeReducer(playerAccountReducer, L.prop('playerAccount')),
  scopeReducer(playerColonyReducer, L.prop('playerColony')),
  scopeReducer(roundReducer, L.prop('currentRound')),
  scopeReducer(factionsReducer, L.prop('activeFactions')),
  scopeReducer(countReducer, L.prop('cellCount')),
  scopeReducer(cellsReducer, L.prop('liveCells')),
  scopeReducer(coloniesReducer, L.prop('colonies')),
  createPlayerAccountReducer,
  foundColonyReducer,
  useGenesisReducer
])

export const state$ = createState(reducer, initialState)
