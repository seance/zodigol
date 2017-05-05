import React from 'react'
import { factionName } from '.'
import { Faction } from '.'
import { FactionSelection } from '.'

export const PlayerColony = ({ playerFaction, onFactionChange, activeFactions, playerColony }) => {
  const isAlive = playerColony.expiryRound < 0
  const isExtinct = playerColony.population <= 0

  const status = isAlive
    ? <span className="active-colony">Active</span>
    : <span className="inactive-colony">Inactive</span>

  const info = [
    <p key="genesis-use">
      While you have Genesis, click anywhere on the Meadow grid to miraculously
      spawn a new animal of your faction there after one round! Remember the rules
      of the Game of Life cellular automata in your choice of location.
    </p>,
    <p key="genesis-grant">
      Your colony receives Genesis approximately once per minute, up to a maximum
      of 5 Genesis.
    </p>
  ]

  const selection = [
    <p>
      To start a new colony, select a faction below and click anywhere on the
      Meadow grid!
    </p>,
    <FactionSelection {...{ playerFaction, onFactionChange, activeFactions }}/>
  ]

  const bottom = isAlive
    ? info
    : selection

  return (
    <div className="player-colony">
      <h2>Empire of the {factionName(playerColony.faction)}</h2>
      <div className="vertical colony-stats">
        <div key="status">
          <span className="stat-key">Status</span> &mdash; {status}
        </div>
        <div key="faction" className="colony-faction">
          <span className="stat-key">Faction</span> &nbsp;&mdash;&nbsp; <Faction faction={playerColony.faction}/>
        </div>
        <div key="leader">
          <span className="stat-key">Leader</span> &mdash; {playerColony.playerName}
        </div>
        <div key="population">
          <span className="stat-key">Population</span> &mdash; {playerColony.population}
        </div>
        <div key="flux">
          <span className="stat-key">Flux</span> &mdash; {playerColony.flux}
        </div>
        <div key="nectar">
          <span className="stat-key">Nectar</span> &mdash; {playerColony.nectar}
        </div>
        <div key="score">
          <span className="stat-key">Score</span> &mdash; {playerColony.flux + playerColony.nectar}
        </div>
        <div key="genesis">
          <span className="stat-key">Genesis</span> &mdash; {playerColony.genesis}
        </div>
      </div>
      <p>
        {
          isAlive ? 'Alive and kicking!' :
          isExtinct ? `Became extinct on round ${playerColony.expiryRound}.` :
         `Gracefully retired on round ${playerColony.expiryRound}.`
        }
      </p>
      {bottom}
    </div>
  )
}
