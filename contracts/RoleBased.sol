pragma solidity ^0.4.8;

contract RoleBased {

  event RegisterGamemaster(address indexed gamemaster);
  event RegisterPlayer(address indexed player, uint indexed id, string name);

  struct Player {
    uint id;
    string name;
  }

  address owner;
  address gamemaster;
  mapping(address => Player) players;

  uint playerIdSeq = 1;

  function RoleBased() {
    owner = msg.sender;
  }

  function registerGamemaster(address gm) onlyOwner {
    gamemaster = gm;
    RegisterGamemaster(gamemaster);
  }

  function registerAsPlayer(string name) {
    Player memory p = players[msg.sender];
    invariant(!isPlayer(p));

    p = Player(playerIdSeq++, name);
    players[msg.sender] = p;

    RegisterPlayer(msg.sender, p.id, p.name);
  }

  function getPlayerAccount() onlyPlayer returns (uint, string) {
    Player storage p = players[msg.sender];
    invariant(isPlayer(p));

    return (p.id, p.name);
  }

  function isPlayer(Player p) internal returns (bool) {
    return p.id > 0;
  }

  function invariant(bool assertion) internal {
    if (!assertion) throw;
  }

  modifier onlyOwner() {
    invariant(msg.sender == owner);
    _;
  }

  modifier onlyGM() {
    var s = msg.sender;
    invariant(s == gamemaster || s == owner);
    _;
  }

  modifier onlyPlayer {
    var s = msg.sender;
    var p = players[s];
    invariant(isPlayer(p) || s == gamemaster || s == owner);
    _;
  }
}
