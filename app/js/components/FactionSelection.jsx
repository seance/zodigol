import React from 'react'
import * as R from 'ramda'
import { Faction } from '.'

export const FactionSelection =({ playerFaction, onFactionChange, activeFactions }) => (
  <div className="faction-selection">
    {R.without(activeFactions, R.range(0, 12)).map(faction =>
      <div key={faction} className="faction-choice">
        <input
          type="radio"
          value={faction}
          checked={playerFaction === faction}
          onChange={() => onFactionChange(faction)}/>
        <Faction faction={faction}/>
      </div>
    )}
  </div>
)
