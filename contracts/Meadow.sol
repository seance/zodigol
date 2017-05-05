pragma solidity ^0.4.8;

contract Meadow {

  enum Faction {
    Rat, Ox, Tiger, Rabbit, Dragon, Snake,
    Horse, Goat, Monkey, Rooster, Dog, Pig
  }

  struct LiveCell {
    uint16 index;
    Faction faction;
  }

  struct NeighborCount {
    uint16 index;
    uint8[] counts;
    uint8 total;
    int8 birth;
    int8 survival;
  }

  LiveCell[] liveCells;

  function Meadow() {
  }

  function getCellCount() returns (uint256) {
    return liveCells.length;
  }

  function getLiveCell(uint16 index) returns (int16, int8) {
    if (liveCells.length > index) {
      var cell = liveCells[index];
      return (int16(cell.index), int8(cell.faction));
    }
    else return (-1, -1);
  }

  function stepEvolution() internal returns (uint16[], uint16[]) {
    LiveCell[] memory cells = liveCells;
    var populations = countPopulations(cells, cells.length);
    var neighbors = mapcatNeighbors(cells);
    var (merged, mergedCount) = mergeNeighbors(neighbors);
    var (newCells, newCount) = applyLifeRules(merged, mergedCount, cells);
    var newPopulations = countPopulations(newCells, newCount);

    liveCells.length = 0;
    for (uint16 i = 0; i < newCount; ++i) {
      liveCells[liveCells.length++] = newCells[i];
    }

    return (populations, newPopulations);
  }

  function countPopulations(LiveCell[] cells, uint count) internal returns (uint16[]) {
    uint16[] memory populations = new uint16[](12);
    for (uint i = 0; i < count; ++i) {
      populations[uint8(cells[i].faction)]++;
    }

    return populations;
  }

  function neighbors(LiveCell c) internal returns (LiveCell[]) {
    LiveCell[] memory ns = new LiveCell[](8);

    uint8 x = getX(c.index);
    uint8 xMinusOne = uint8(int(x) - 1) % 32;
    uint8 xPlusOne = uint8(int(x) + 1) % 32;
    uint8 y = getY(c.index);
    uint8 yMinusOne = uint8(int(y) - 1) % 32;
    uint8 yPlusOne = uint8(int(y) + 1) % 32;

    ns[0] = LiveCell(getIndex(xMinusOne, yMinusOne), c.faction);
    ns[1] = LiveCell(getIndex(xMinusOne, y), c.faction);
    ns[2] = LiveCell(getIndex(xMinusOne, yPlusOne), c.faction);
    ns[3] = LiveCell(getIndex(x, yMinusOne), c.faction);
    ns[4] = LiveCell(getIndex(x, yPlusOne), c.faction);
    ns[5] = LiveCell(getIndex(xPlusOne, yMinusOne), c.faction);
    ns[6] = LiveCell(getIndex(xPlusOne, y), c.faction);
    ns[7] = LiveCell(getIndex(xPlusOne, yPlusOne), c.faction);

    return ns;
  }

  function mapcatNeighbors(LiveCell[] cells) internal returns (LiveCell[]) {
    LiveCell[] memory ss = new LiveCell[](cells.length * 8);
    for (uint16 i = 0; i < cells.length; ++i) {
      var ns = neighbors(cells[i]);
      uint dp; uint sp; uint block = i * 8 * 32;
      assembly {
        dp := add(ss, 32)
        sp := add(ns, 32)
        mstore(add(dp, block), mload(sp))
        mstore(add(dp, add(block, 32)), mload(add(sp, 32)))
        mstore(add(dp, add(block, 64)), mload(add(sp, 64)))
        mstore(add(dp, add(block, 96)), mload(add(sp, 96)))
        mstore(add(dp, add(block, 128)), mload(add(sp, 128)))
        mstore(add(dp, add(block, 160)), mload(add(sp, 160)))
        mstore(add(dp, add(block, 192)), mload(add(sp, 192)))
        mstore(add(dp, add(block, 224)), mload(add(sp, 224)))
      }
    }
    return ss;
  }

  function mergeNeighbors(LiveCell[] cells)
    internal
    returns (NeighborCount[], uint16 count)
  {
    NeighborCount[] memory ns = new NeighborCount[](cells.length);
    uint16[] memory uniques = new uint16[](1024);
    NeighborCount memory n;

    for (uint16 i = 0; i < cells.length; ++i) {
      var cell = cells[i];
      var faction = uint8(cell.faction);
      var key = cell.index;
      var index = uniques[key];

      if (index == 0) {
        n = NeighborCount(cell.index, new uint8[](12), 1, -1, -1);
        n.counts[faction] = 1;
        uniques[key] = count + 1;
        ns[count++] = n;
      } else {
        n = ns[index - 1];
        n.counts[faction]++;
        n.total++;
        n.birth = (n.counts[faction] == 3 && n.total == 3) ? int8(faction) : -1;
        n.survival = (n.counts[faction] == 2 && n.total <= 3) ? int8(faction) : -1;
      }
    }

    return (ns, count);
  }

  function applyLifeRules(NeighborCount[] ns, uint16 nsCount, LiveCell[] liveCells)
    internal
    returns (LiveCell[], uint16 count)
  {
    LiveCell[] memory newLiveCells = new LiveCell[](nsCount);
    int8[] memory factions = indexFactions(liveCells);
    uint16 liveCount = 0;

    for (uint16 i = 0; i < nsCount; ++i) {
      var neighbor = ns[i];
      int8 bornFaction;
      int8 survivedFaction;

      if ((bornFaction = isBirth(neighbor)) >= 0) {
        newLiveCells[liveCount++] = LiveCell(
          neighbor.index,
          Faction(bornFaction)
        );
      } else if ((survivedFaction = isSurvival(neighbor, factions)) >= 0) {
        newLiveCells[liveCount++] = LiveCell(
          neighbor.index,
          Faction(survivedFaction)
        );
      }
    }

    return (newLiveCells, liveCount);
  }

  function indexFactions(LiveCell[] liveCells) internal returns (int8[]) {
    int8[] memory factions = new int8[](1024);

    for (uint16 i = 0; i < liveCells.length; i++) {
      var cell = liveCells[i];
      factions[cell.index] = int8(cell.faction) + 1;
    }

    return factions;
  }

  function isBirth(NeighborCount neighbor) internal returns (int8) {
    return neighbor.total == 3 ? neighbor.birth : -1;
  }

  function isSurvival(NeighborCount neighbor, int8[] factions)
    internal
    returns (int8)
  {
    if (neighbor.total <= 3 && neighbor.survival >= 0) {
      var current = factions[neighbor.index] - 1;
      return (neighbor.survival == current) ? current : -1;
    }
    else return -1;
  }

  function getIndex(uint8 x, uint8 y) internal returns (uint16) {
    return 32 * uint16(y) + uint16(x);
  }

  function getX(uint16 index) internal returns (uint8) {
    return uint8(index % 32);
  }

  function getY(uint16 index) internal returns (uint8) {
    return uint8(index / 32);
  }

  function isFreeCell(uint16 index) internal returns (bool) {
    for (uint16 i = 0; i < liveCells.length; i++) {
      var cell = liveCells[i];
      if (cell.index == index) {
        return false;
      }
    }

    return true;
  }

  function insertLiveCell(LiveCell cell) internal {
    liveCells.push(cell);
  }

  function removeFactionLiveCells(uint8 faction) internal {
    for (uint i = 0; i < liveCells.length; ++i) {
      if (uint8(liveCells[i].faction) == faction) {
        removeLiveCell(i--);
      }
    }
  }

  function removeLiveCell(uint index) internal {
    liveCells[index] = liveCells[liveCells.length - 1];
    liveCells.length--;
  }
}
