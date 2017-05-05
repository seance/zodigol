import React from 'react'
import * as R from 'ramda'

export const Registration = ({ playerName, onNameChange, createPlayerAccount }) => (
  <div className="registration">
    <h2>
      Welcome to Zodigol!
    </h2>
    <article>
      Enter a player name below and click Register to join the fun!
    </article>
    <div className="registration-controls">
      <input
        type="text"
        value={playerName}
        onChange={e => onNameChange(e.target.value)}
        placeholder="Player name"
        maxLength="20"
        minLength="1"
        pattern="[\w\s\d]"
        />
      <button onClick={e => createPlayerAccount(playerName)}>
        Register
      </button>
    </div>
  </div>
)
