import React from 'react'
import * as R from 'ramda'
import { threesome } from '../grid'

const getLeft = index => 24 * (index % 32)

const getTop = index => 24 * (Math.floor(index / 32))

const clickGrid = (index, playerFaction, playerAccount, playerColony, foundColony, useGenesis) => {
  if (!playerAccount) {
    /* ignored */
  } else if (!playerColony || playerColony.expiryRound >= 0) {
    foundColony([playerFaction, threesome(index)])
  } else if (playerColony.genesis) {
    useGenesis(index)
  }
}

export const Meadow = ({
  liveCells,
  playerFaction,
  playerAccount,
  playerColony,
  foundColony,
  useGenesis
}) => {
  const grid = R.range(0, 1024).map(index =>
    <div
      key={`grid-${index}`}
      className="grid-cell"
      onClick={() => clickGrid(index, playerFaction, playerAccount, playerColony, foundColony, useGenesis)}>
    </div>
  )

  const cells = liveCells.map((cell, i) =>
    <div key={`cell-${cell.faction}-${i}`}
      className={`live-cell faction-${cell.faction}`}
      style={{
        left: `${getLeft(cell.index)}px`,
        top: `${getTop(cell.index)}px`
      }}>
    </div>
  )

  return (
    <div className="meadow">
      {grid}
      {cells}
    </div>
  )
}
