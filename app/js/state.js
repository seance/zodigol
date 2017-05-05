import * as R from 'ramda'
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
  scoped,
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

const createPlayerAccountReducer = effectReducer(createPlayerAccount, playerName => {
  console.log('Create account for', playerName)
  confirmTx(zodigol.registerAsPlayer(playerName, {
    from: account,
    gas: 4e6
  })).then(() => {
    console.log('Created account for', playerName)
  }).catch(() => {
    console.error('Failed to create account for', playerName)
  })
})

const foundColonyReducer = effectReducer(foundColony, ([faction, cells]) => {
  console.log(`Found colony faction ${faction} at ${cells}`)
  confirmTx(zodigol.foundColony(faction, cells, {
    from: account,
    gas: 4e6
  })).then(() => {
    console.log(`Founded colony faction ${faction} at ${cells}`)
  }).catch(() => {
    console.error(`Failed to found colony faction ${faction} at ${cells}`)
  })
})

const useGenesisReducer = effectReducer(useGenesis, index => {
  console.log(`Use genesis at ${index}`)
  confirmTx(zodigol.useGenesis(index, {
    from: account,
    gas: 4e6
  })).then(() => {
    console.log(`Used genesis at ${index}`)
  }).catch(() => {
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
  scoped(playerNameReducer, L.prop('playerName')),
  scoped(playerFactionReducer, L.prop('playerFaction')),
  scoped(playerAccountReducer, L.prop('playerAccount')),
  scoped(playerColonyReducer, L.prop('playerColony')),
  scoped(roundReducer, L.prop('currentRound')),
  scoped(factionsReducer, L.prop('activeFactions')),
  scoped(countReducer, L.prop('cellCount')),
  scoped(cellsReducer, L.prop('liveCells')),
  scoped(coloniesReducer, L.prop('colonies')),
  createPlayerAccountReducer,
  foundColonyReducer,
  useGenesisReducer
])

export const state$ = createState(reducer, initialState)
