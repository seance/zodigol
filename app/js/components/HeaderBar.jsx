import React from 'react'

export const HeaderBar = ({ playerAccount }) => (
  <div className="header-bar horizontal">
    <h1>Zodigol</h1>
    <h2>&mdash; Zodiac Game of Life</h2>
    <span>{window.account}</span>
    <a href="http://zodigol.kadath.cloud/" target="_blank">Ethereum Dashboard</a>
    <span>Hello, {playerAccount ? playerAccount.name : 'stranger'}!</span>
  </div>
)
