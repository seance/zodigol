export const mapPlayer = ([id, name]) => ({
  id: id.toNumber(),
  name: name.toString()
})

export const mapLiveCell = ([index, faction]) => ({
  index: index.toNumber(),
  faction: faction.toNumber()
})

export const mapColony = ps => ({
  id: ps[0].toNumber(),
  playerId: ps[1].toNumber(),
  playerName: ps[2].toString(),
  faction: ps[3].toNumber(),
  population: ps[4].toNumber(),
  flux: ps[5].toNumber(),
  nectar: ps[6].toNumber(),
  genesis: ps[7].toNumber(),
  prevGenesisRound: ps[8].toNumber(),
  expiryRound: ps[9].toNumber()
})
