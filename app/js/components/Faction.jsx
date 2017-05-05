import React from 'react'
import * as R from 'ramda'

export const factionName = faction => {
  switch (faction) {
    case 0: return 'Rat'
    case 1: return 'Ox'
    case 2: return 'Tiger'
    case 3: return 'Rabbit'
    case 4: return 'Dragon'
    case 5: return 'Snake'
    case 6: return 'Horse'
    case 7: return 'Goat'
    case 8: return 'Monkey'
    case 9: return 'Rooster'
    case 10: return 'Dog'
    case 11: return 'Pig'
    default: return 'Unknown'
  }
}

export const Faction = ({ faction }) => (
  <div className="horizontal faction">
    <div key={`icon-${faction}`} className={`faction-icon faction-${faction}`}></div>
    <div key={`name-${faction}`} className="faction-name">{factionName(faction)}</div>
  </div>
)
