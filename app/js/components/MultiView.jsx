import React from 'react'
import {
  Registration,
  Founding,
  PlayerColony
} from '.'

export const MultiView = props => {
  return !props.playerAccount ? <Registration {...props}/> :
    !props.playerColony ? <Founding {...props}/> :
    <PlayerColony {...props}/>
}
