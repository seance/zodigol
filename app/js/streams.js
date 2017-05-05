import xstream from 'xstream'
import * as R from 'ramda'
import { switchMapPromise } from './xs-utils'
import {
  mapPlayer,
  mapLiveCell,
  mapColony
} from './mapping'

export const blockId$ = xstream.create({
  start: listener => {
    eth.filter('latest').watch((err, blockId) => {
      if (err) listener.error(err)
      else listener.next(blockId)
    })
  },
  stop: () => {}
})

export const playerAccount$ = switchMapPromise(blockId$, blockId =>
  zodigol.getPlayerAccount.call().then(p => mapPlayer(p)).catch(() => undefined))

export const playerColony$ = switchMapPromise(blockId$, blockId =>
  zodigol.getPlayerColony.call().then(c => mapColony(c)).catch(() => undefined))

export const round$ = switchMapPromise(blockId$, blockId =>
  zodigol.getCurrentRound.call().then(r => r.toNumber()))

export const count$ = switchMapPromise(blockId$, blockId =>
  zodigol.getCellCount.call().then(c => c.toNumber()))

export const cells$ = switchMapPromise(count$, count =>
  Promise.map(R.range(0, count), index =>
    zodigol.getLiveCell.call(index).then(c => mapLiveCell(c))
  ))

export const factions$ = switchMapPromise(blockId$, blockId =>
  zodigol.getActiveFactions.call().then(fs =>
    fs.map(f => f.toNumber())))

export const colonies$ = switchMapPromise(factions$, factions =>
  Promise.map(factions, faction =>
    zodigol.getColony.call(faction).then(c => mapColony(c))
  ))
