import React from 'react'
import * as R from 'ramda'
import { FactionSelection } from '.'

export const Founding = ({ playerFaction, onFactionChange, activeFactions }) => (
  <div className="founding">
    <h2>
      Founding a Colony
    </h2>
    <article>
      <p>Next, you'll need to found your very own colony.</p>
      <p>
        To accomplish this, select one of the factions below, and click anywhere
        on the Meadow grid to the left.
      </p>
      <p>
        Your colony will consist of 3 animals to start with, placed on the grid
        you clicked and on either side, wrapping over the grid if necessary.
      </p>
    </article>
    <FactionSelection {...{ playerFaction, onFactionChange, activeFactions }}/>
  </div>
)
