import React from 'react'
import * as R from 'ramda'
import { Faction } from '.'

export const Scoreboard = ({ colonies }) => {
  const sorted = R.sortBy(c => -(c.flux + c.nectar), colonies)
  const items = sorted.map((c, i) =>
    <tr key={c.id} className="scoreboard-colony">
      <td className="colony-rank">{i + 1}</td>
      <td className="colony-player">{c.playerName}</td>
      <td className="colony-faction">
        <Faction faction={c.faction}/>
      </td>
      <td className="colony-population">{c.population}</td>
      <td className="colony-genesis">{c.genesis}</td>
      <td className="colony-flux">{c.flux}</td>
      <td className="colony-nectar">{c.nectar}</td>
      <td className="colony-score">{c.flux + c.nectar}</td>
    </tr>
  )

  return (
    <div className="scoreboard vertical">
      <h2>Scoreboard</h2>
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Faction</th>
            <th>Pop.</th>
            <th>Genesis</th>
            <th>Flux</th>
            <th>Nectar</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  )
}
