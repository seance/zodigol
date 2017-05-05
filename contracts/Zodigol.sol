pragma solidity ^0.4.8;

import './RoleBased.sol';
import './Meadow.sol';

contract Zodigol is RoleBased, Meadow {

  uint constant MAX_GENESIS = 5;
  uint constant GENESIS_GRANT_FREQ = 6;
  uint constant MAX_COLONY_AGE = 8640;

  enum ColonyExpiryReason {
    PopulationExtinct,
    LifespanExceeded
  }

  event ColonyExpired(uint indexed id, uint8 reason);
  event FoundColony(uint indexed id, uint indexed playerId, uint8 indexed faction);
  event UseGenesis(uint indexed playerId, uint16 indexed cellIndex, uint indexed round, uint genesis);
  event GrantGenesis(uint indexed colonyId, uint indexed colonyAge, uint indexed round, uint genesis);
  event RunGameRound(uint indexed round);

  struct Colony {
    uint id;
    Player player;
    Faction faction;
    uint startRound;
    uint population;
    uint flux;
    uint nectar;
    uint genesis;
    int prevGenesisRound;
    int expiryRound;
  }

  mapping(address => Colony) playerToColony;
  mapping(uint8 => address) factionToPlayer;

  Faction[] activeFactions;
  LiveCell[] pendingCells;

  uint colonyIdSeq = 1;
  uint currentRound = 1;

  function Zodigol() {
  }

  function runGameRound() onlyGM {
    insertPendingCells();
    var (prevPops, nextPops) = stepEvolution();
    updateColonies(prevPops, nextPops);
    RunGameRound(currentRound++);
  }

  function getCurrentRound() returns (uint) {
    return currentRound;
  }

  function getActiveFactions() returns (uint8[]) {
    uint8[] memory factions = new uint8[](activeFactions.length);
    for (uint i = 0; i < activeFactions.length; ++i) {
      factions[i] = uint8(activeFactions[i]);
    }

    return factions;
  }

  function getColony(uint8 faction)
    returns (uint, uint, string, uint8, uint, uint, uint, uint, int, int)
  {
    address player = factionToPlayer[faction];
    Colony storage colony = playerToColony[player];
    invariant(isColony(colony));

    return (
      colony.id,
      colony.player.id,
      colony.player.name,
      uint8(colony.faction),
      colony.population,
      colony.flux,
      colony.nectar,
      colony.genesis,
      colony.prevGenesisRound,
      colony.expiryRound
    );
  }

  function foundColony(uint8 faction, uint16[] startCells) onlyPlayer {
    Player storage player = players[msg.sender];
    Colony memory colony = playerToColony[msg.sender];
    Faction fact = Faction(faction);

    invariant(
      !isColonyActive(colony) &&
      isFactionAvailable(fact) &&
      startCells.length == 3 &&
      areFreeCells(startCells));

    colony = Colony(colonyIdSeq++, player, fact, currentRound, startCells.length, 0, 0, 1, -1, -1);
    playerToColony[msg.sender] = colony;
    factionToPlayer[faction] = msg.sender;
    activeFactions.push(fact);
    queuePendingCells(fact, startCells);

    FoundColony(colony.id, colony.player.id, uint8(colony.faction));
  }

  function getPlayerColony()
    onlyPlayer
    returns (uint, uint, string, uint8, uint, uint, uint, uint, int, int)
  {
    Colony storage colony = playerToColony[msg.sender];
    invariant(isColony(colony));

    return (
      colony.id,
      colony.player.id,
      colony.player.name,
      uint8(colony.faction),
      colony.population,
      colony.flux,
      colony.nectar,
      colony.genesis,
      colony.prevGenesisRound,
      colony.expiryRound
    );
  }

  function useGenesis(uint16 cell) onlyPlayer {
    Player storage player = players[msg.sender];
    Colony storage colony = playerToColony[msg.sender];
    uint16[] memory cellArray = new uint16[](1);
    cellArray[0] = cell;

    invariant(
      isPlayerColony(colony, player) &&
      hasGenesis(colony) &&
      !usedGenesisThisRound(colony) &&
      areFreeCells(cellArray));

    queuePendingCells(colony.faction, cellArray);
    colony.prevGenesisRound = int(currentRound);
    colony.genesis--;

    UseGenesis(player.id, cell, currentRound, colony.genesis);
  }

  function updateColonies(uint16[] prevPops, uint16[] nextPops) internal {
    for (uint i = 0; i < activeFactions.length; ++i) {
      uint8 faction = uint8(activeFactions[i]);
      address player = factionToPlayer[faction];
      Colony storage colony = playerToColony[player];

      var prevPopulation = prevPops[faction];
      var nextPopulation = nextPops[faction];
      var netIncrease = nextPopulation > prevPopulation
        ? prevPopulation - nextPopulation
        : 0;

      colony.population = nextPopulation;
      colony.nectar += nextPopulation;
      colony.flux += 2 * netIncrease * netIncrease;

      if (isColonyPopulationExtinct(colony.population)) {
        colony.expiryRound = int(currentRound);
        removeActiveFaction(i--);
        removeFactionLiveCells(faction);
        ColonyExpired(colony.id, uint8(ColonyExpiryReason.PopulationExtinct));
      }
      else if (isColonyLifespanExceeded(colony.startRound)) {
        colony.expiryRound = int(currentRound);
        removeActiveFaction(i--);
        removeFactionLiveCells(faction);
        ColonyExpired(colony.id, uint8(ColonyExpiryReason.LifespanExceeded));
      }
      else if (isGenesisGrantCondition(colony.startRound, colony.genesis)) {
        colony.genesis++;
        GrantGenesis(colony.id, currentRound - colony.startRound, currentRound, colony.genesis);
      }
    }
  }

  function isColonyPopulationExtinct(uint colonyPopulation) internal returns (bool) {
    return colonyPopulation <= 0;
  }

  function isColonyLifespanExceeded(uint startRound) internal returns (bool) {
    var colonyAge = currentRound - startRound;
    return colonyAge > MAX_COLONY_AGE;
  }

  function isGenesisGrantCondition(uint startRound, uint genesis) internal returns (bool) {
    var colonyAge = currentRound - startRound;
    var isTime = (colonyAge > 0) && (colonyAge % GENESIS_GRANT_FREQ == 0);
    var isNotMaxed = genesis < MAX_GENESIS;
    return isTime && isNotMaxed;
  }

  function removeActiveFaction(uint index) internal {
    Faction faction = activeFactions[index];
    activeFactions[index] = activeFactions[activeFactions.length - 1];
    activeFactions.length--;
  }

  function isColony(Colony colony) internal returns (bool) {
    return colony.id > 0;
  }

  function isColonyActive(Colony colony) internal returns (bool) {
    return isColony(colony) && colony.expiryRound < 0;
  }

  function isPlayerColony(Colony storage colony, Player storage player)
    internal
    returns (bool)
  {
    return colony.player.id == player.id;
  }

  function isFactionAvailable(Faction faction) internal returns (bool) {
    for (uint8 i = 0; i < activeFactions.length; ++i) {
      if (activeFactions[i] == faction) {
        return false;
      }
    }

    return true;
  }

  function areFreeCells(uint16[] cells) internal returns (bool) {
    for (uint i = 0; i < cells.length; ++i) {
      if (!isFreeCell(cells[i]) || isPendingCell(cells[i])) {
        return false;
      }
    }

    return true;
  }

  function isPendingCell(uint16 index) internal returns (bool) {
    for (uint i = 0; i < pendingCells.length; ++i) {
      if (pendingCells[i].index == index) {
        return true;
      }
    }

    return false;
  }

  function hasGenesis(Colony colony) internal returns (bool) {
    return colony.genesis > 0;
  }

  function usedGenesisThisRound(Colony colony) internal returns (bool) {
    return colony.prevGenesisRound == int(currentRound);
  }

  function queuePendingCells(Faction faction, uint16[] cells) internal {
    for (uint i = 0; i < cells.length; ++i) {
      pendingCells.push(LiveCell(cells[i], faction));
    }
  }

  function insertPendingCells() internal {
    for (uint i = 0; i < pendingCells.length; ++i) {
      insertLiveCell(pendingCells[i]);
    }
    pendingCells.length = 0;
  }
}
