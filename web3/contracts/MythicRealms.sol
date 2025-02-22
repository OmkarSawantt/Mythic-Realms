// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MythicRealms is ERC1155, Ownable, ERC1155Supply, ReentrancyGuard {
    string public baseURI;
    uint256 public totalSupply;
    uint256 public constant MAX_ATTACK_DEFEND_STRENGTH = 10;
    uint256 private tokenIdCounter = 1;

    enum BattleStatus {
        PENDING,
        STARTED,
        ENDED
    }

    struct GameToken {
        string name;
        uint256 id;
        uint256 tokenHash;
        uint256 attackStrength;
        uint256 defenseStrength;
    }

    struct Player {
        address playerAddress;
        string playerName;
        uint256 playerMana;
        uint256 playerHealth;
        bool inBattle;
    }

    struct Battle {
        BattleStatus battleStatus;
        string name;
        address[2] players;
        uint256[2] playerTokenIds;
        uint256[2] moves;
        address winner;
    }

    mapping(address => uint256) public playerInfo;
    mapping(address => uint256[]) public playerTokenInfo;
    mapping(string => uint256) public battleInfo;
    Player[] public players;
    GameToken[] public gameTokens;
    Battle[] public battles;

    event NewPlayer(address indexed owner, string name);
    event NewBattle(string battleName, address indexed player1, address indexed player2);
    event BattleEnded(string battleName, address indexed winner, address indexed loser);
    event BattleMove(string indexed battleName, bool indexed isFirstMove);
    event NewGameToken(address indexed owner, uint256 id, uint256 attackStrength, uint256 defenseStrength);
    event RoundEnded(address[2] damagedPlayers);

    constructor(string memory _metadataURI) ERC1155(_metadataURI) {
        baseURI = _metadataURI;
        initialize();
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function initialize() private {
        gameTokens.push(GameToken("", 0, 0, 0, 0));
        players.push(Player(address(0), "", 0, 0, false));
        battles.push(
            Battle(
                BattleStatus.PENDING,
                "",
                [address(0), address(0)],
                [uint256(0), uint256(0)],
                [uint256(0), uint256(0)],
                address(0)
            )
        );
    }

    function isPlayer(address addr) public view returns (bool) {
        return playerInfo[addr] > 0;
    }

    function registerPlayer(string memory _name) external {
        require(!isPlayer(msg.sender), "Player already registered");
        uint256 _id = players.length;
        players.push(Player(msg.sender, _name, 10, 25, false));
        playerInfo[msg.sender] = _id;
        emit NewPlayer(msg.sender, _name);
    }

    function getPlayer(address addr) public view returns (Player memory) {
        require(isPlayer(addr), "Player doesn't exist!");
        return players[playerInfo[addr]];
    }

    function updatePlayerName(string memory _newName) external {
        require(isPlayer(msg.sender), "Player not registered");
        uint256 index = playerInfo[msg.sender];
        require(index < players.length, "Invalid player index");
        players[index].playerName = _newName;
    }

    function isPlayerToken(address addr) public view returns (bool) {
        return playerTokenInfo[addr].length > 0;
    }

    function createRandomGameToken(string memory _name) public {
        require(!getPlayer(msg.sender).inBattle, "Player is in a battle");
        require(isPlayer(msg.sender), "Please Register Player First");
        require(!isPlayerToken(msg.sender), "Player already has a token");
        _createGameToken(_name);
    }

    function _createGameToken(string memory _name) internal returns (GameToken memory) {
        uint256 randAttackStrength = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, msg.sender);
        uint256 randDefenseStrength = MAX_ATTACK_DEFEND_STRENGTH - randAttackStrength;
        uint256 randHash = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 30 + 1;

        GameToken memory newGameToken = GameToken(
            _name,
            tokenIdCounter,
            randHash,
            randAttackStrength,
            randDefenseStrength
        );

        gameTokens.push(newGameToken);
        playerTokenInfo[msg.sender].push(tokenIdCounter);
        tokenIdCounter++;
        totalSupply++;
        emit NewGameToken(msg.sender, tokenIdCounter, randAttackStrength, randDefenseStrength);
        return newGameToken;
    }

    function _createRandomNum(uint256 _max, address _sender) internal view returns (uint256 randomValue) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _sender)));
        randomValue = randomNum % _max;
        if (randomValue == 0) {
            randomValue = _max / 2;
        }
        return randomValue;
    }

    function getAllBattles() public view returns (Battle[] memory) {
        return battles;
    }

    function getPlayerTokenById(address addr, uint256 id) public view returns (GameToken memory) {
        require(isPlayerToken(addr), "Game token doesn't exist!");
        uint256[] memory tokenIds = playerTokenInfo[addr];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == id) {
                return gameTokens[id];
            }
        }
        revert("Token with the given ID not found");
    }

    function getPlayerTokenHash(address addr, uint256 id) public view returns (uint256) {
        require(isPlayerToken(addr), "Game token doesn't exist!");
        uint256[] memory tokenIds = playerTokenInfo[addr];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == id) {
                return gameTokens[id].tokenHash;
            }
        }
        revert("Token with the given ID not found");
    }

    function isBattle(string memory _name) public view returns (bool) {
        return battleInfo[_name] != 0;
    }

    function getBattle(string memory _name) public view returns (Battle memory) {
        require(isBattle(_name), "Battle doesn't exist!");
        return battles[battleInfo[_name]];
    }

    function createBattle(string memory _name, uint256 playerTokenId) external returns (Battle memory) {
        require(isPlayer(msg.sender), "Please Register Player First");
        require(isPlayerToken(msg.sender), "You must have a token to enter the battle!");
        require(!isBattle(_name), "Battle already exists!");
        require(_ownsToken(msg.sender, playerTokenId), "You don't own this token!");

        Battle memory _battle = Battle({
            battleStatus: BattleStatus.PENDING,
            name: _name,
            players: [msg.sender, address(0)],
            playerTokenIds: [playerTokenId, 0],
            moves: [uint256(0), uint256(0)],
            winner: address(0)
        });

        battles.push(_battle);
        battleInfo[_name] = battles.length - 1;
        return _battle;
    }

    function joinBattle(string memory _name, uint256 playerTokenId) external returns (Battle memory) {
        require(isBattle(_name), "Battle does not exist");
        uint256 battleIndex = battleInfo[_name];
        Battle storage _battle = battles[battleIndex];

        require(_battle.battleStatus == BattleStatus.PENDING, "Battle already started!");
        require(_battle.players[0] != msg.sender, "Only player two can join a battle");
        require(!getPlayer(msg.sender).inBattle, "Already in battle");
        require(isPlayerToken(msg.sender), "You must have a token to join the battle!");
        require(_ownsToken(msg.sender, playerTokenId), "You don't own this token!");

        _battle.battleStatus = BattleStatus.STARTED;
        _battle.players[1] = msg.sender;
        _battle.playerTokenIds[1] = playerTokenId;

        players[playerInfo[_battle.players[0]]].inBattle = true;
        players[playerInfo[_battle.players[1]]].inBattle = true;
        emit NewBattle(_battle.name, _battle.players[0], msg.sender);
        return _battle;
    }

    function _ownsToken(address player, uint256 tokenId) internal view returns (bool) {
        uint256[] storage tokens = playerTokenInfo[player];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                return true;
            }
        }
        return false;
    }

    function getBattleMoves(string memory _battleName) public view returns (uint256 P1Move, uint256 P2Move) {
        Battle memory _battle = getBattle(_battleName);
        P1Move = _battle.moves[0];
        P2Move = _battle.moves[1];
        return (P1Move, P2Move);
    }

    function _registerPlayerMove(uint256 _player, uint8 _choice, string memory _battleName) internal {
        require(_choice == 1 || _choice == 2, "Choice should be either 1 or 2!");
        require(_choice == 1 ? getPlayer(msg.sender).playerMana >= 3 : true, "Mana not sufficient for attacking!");
        battles[battleInfo[_battleName]].moves[_player] = _choice;
    }

    function attackOrDefendChoice(uint8 _choice, string memory _battleName) external {
        Battle memory _battle = getBattle(_battleName);

    require(
        _battle.battleStatus == BattleStatus.STARTED,
        "Battle not started. Please tell another player to join the battle"
    ); // Require that battle has started
    require(
        _battle.battleStatus != BattleStatus.ENDED,
        "Battle has already ended"
    ); // Require that battle has not ended
    require(
      msg.sender == _battle.players[0] || msg.sender == _battle.players[1],
      "You are not in this battle"
    ); // Require that player is in the battle

    require(_battle.moves[_battle.players[0] == msg.sender ? 0 : 1] == 0, "You have already made a move!");

    _registerPlayerMove(_battle.players[0] == msg.sender ? 0 : 1, _choice, _battleName);

    _battle = getBattle(_battleName);
    uint _movesLeft = 2 - (_battle.moves[0] == 0 ? 0 : 1) - (_battle.moves[1] == 0 ? 0 : 1);
    emit BattleMove(_battleName, _movesLeft == 1 ? true : false);

    if(_movesLeft == 0) {
      _awaitBattleResults(_battleName);
    }
    }

    function _awaitBattleResults(string memory _battleName) internal {
        Battle memory _battle = getBattle(_battleName);

        require(msg.sender == _battle.players[0] || msg.sender == _battle.players[1], "Only players in this battle can make a move");
        require(_battle.moves[0] != 0 && _battle.moves[1] != 0, "Players still need to make a move");

        _resolveBattle(_battle);
    }
    function _resolveBattle(Battle memory _battle) internal {
    GameToken memory playre1_token = getPlayerTokenById(_battle.players[0], _battle.playerTokenIds[0]);
    GameToken memory playre2_token = getPlayerTokenById(_battle.players[1], _battle.playerTokenIds[1]);

    address[2] memory _damagedPlayers = [address(0), address(0)];

    if (_battle.moves[0] == 1 && _battle.moves[1] == 1) {
        if (playre1_token.attackStrength >= getPlayer(_battle.players[1]).playerHealth) {
            //_endBattle(_battle.players[0], _battle);
            _battle.battleStatus = BattleStatus.ENDED;
            _battle.winner = _battle.players[0];
            updateBattle(_battle.name, _battle);
            uint p1 = playerInfo[_battle.players[0]];
            uint p2 = playerInfo[_battle.players[1]];
            players[p1].inBattle = false;
            players[p1].playerHealth = 25;
            players[p1].playerMana = 10;
            players[p2].inBattle = false;
            players[p2].playerHealth = 25;
            players[p2].playerMana = 10;
            address _battleLoser = _battle.players[1] ;
            emit BattleEnded(_battle.name, _battle.winner, _battleLoser);
            return;
        } else if (playre2_token.attackStrength >= getPlayer(_battle.players[0]).playerHealth) {
            // _endBattle(_battle.players[1], _battle);
            _battle.battleStatus = BattleStatus.ENDED;
            _battle.winner = _battle.players[1];
            updateBattle(_battle.name, _battle);
            uint p1 = playerInfo[_battle.players[0]];
            uint p2 = playerInfo[_battle.players[1]];
            players[p1].inBattle = false;
            players[p1].playerHealth = 25;
            players[p1].playerMana = 10;
            players[p2].inBattle = false;
            players[p2].playerHealth = 25;
            players[p2].playerMana = 10;
            address _battleLoser = _battle.players[0];
            emit BattleEnded(_battle.name, _battle.winner, _battleLoser);
            return;
        } else {
            players[playerInfo[_battle.players[0]]].playerHealth -= playre2_token.attackStrength;
            players[playerInfo[_battle.players[1]]].playerHealth -= playre1_token.attackStrength;
            players[playerInfo[_battle.players[0]]].playerMana -= 3;
            players[playerInfo[_battle.players[1]]].playerMana -= 3;
            _damagedPlayers = _battle.players;
        }
    } else if (_battle.moves[0] == 1 && _battle.moves[1] == 2) {
    uint256 PHAD = getPlayer(_battle.players[1]).playerHealth + playre2_token.defenseStrength;
    if (playre1_token.attackStrength >= PHAD) {
        //_endBattle(_battle.players[0], _battle);
        _battle.battleStatus = BattleStatus.ENDED;
        _battle.winner = _battle.players[0];
        updateBattle(_battle.name, _battle);
        uint p1 = playerInfo[_battle.players[0]];
        uint p2 = playerInfo[_battle.players[1]];
        players[p1].inBattle = false;
        players[p1].playerHealth = 25;
        players[p1].playerMana = 10;
        players[p2].inBattle = false;
        players[p2].playerHealth = 25;
        players[p2].playerMana = 10;
        address _battleLoser = _battle.players[1];
        emit BattleEnded(_battle.name, _battle.winner, _battleLoser);
        return;
    } else {
        uint256 healthAfterAttack;
        if(playre2_token.defenseStrength > playre1_token.attackStrength) {
            healthAfterAttack = getPlayer(_battle.players[1]).playerHealth;
        } else {
            healthAfterAttack = PHAD - playre1_token.attackStrength;
            _damagedPlayers[0] = _battle.players[1];
        }
        players[playerInfo[_battle.players[1]]].playerHealth = healthAfterAttack;
        players[playerInfo[_battle.players[0]]].playerMana -= 3;
        players[playerInfo[_battle.players[1]]].playerMana += 3;
    }
    } else if (_battle.moves[0] == 2 && _battle.moves[1] == 1) {
        uint256 PHAD = getPlayer(_battle.players[0]).playerHealth + playre1_token.defenseStrength;
        if (playre2_token.attackStrength >= PHAD) {
            //_endBattle(_battle.players[1], _battle);
            _battle.battleStatus = BattleStatus.ENDED;
            _battle.winner = _battle.players[1];
            updateBattle(_battle.name, _battle);
            uint p1 = playerInfo[_battle.players[0]];
            uint p2 = playerInfo[_battle.players[1]];
            players[p1].inBattle = false;
            players[p1].playerHealth = 25;
            players[p1].playerMana = 10;
            players[p2].inBattle = false;
            players[p2].playerHealth = 25;
            players[p2].playerMana = 10;
            address _battleLoser =_battle.players[0];
            emit BattleEnded(_battle.name, _battle.winner, _battleLoser);
            return;
        } else {
            uint256 healthAfterAttack;

            if(playre1_token.defenseStrength > playre2_token.attackStrength) {
                healthAfterAttack = getPlayer(_battle.players[0]).playerHealth;
            } else {
                healthAfterAttack = PHAD - playre2_token.attackStrength;
                _damagedPlayers[0] = _battle.players[0];
            }
            players[playerInfo[_battle.players[0]]].playerHealth = healthAfterAttack;
            players[playerInfo[_battle.players[0]]].playerMana += 3;
            players[playerInfo[_battle.players[1]]].playerMana -= 3;
        }
    }else if (_battle.moves[0] == 2 && _battle.moves[1] == 2) {
        players[playerInfo[_battle.players[0]]].playerMana += 3;
        players[playerInfo[_battle.players[1]]].playerMana += 3;
    }
    emit RoundEnded(_damagedPlayers);
    _battle.moves[0] = 0;
    _battle.moves[1] = 0;
    updateBattle(_battle.name, _battle);

    uint256 _randomAttackStrengthPlayer1 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, _battle.players[0]);
    gameTokens[_battle.playerTokenIds[0]].attackStrength = _randomAttackStrengthPlayer1;
    gameTokens[_battle.playerTokenIds[0]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - _randomAttackStrengthPlayer1;

    uint256 _randomAttackStrengthPlayer2 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, _battle.players[1]);
    gameTokens[_battle.playerTokenIds[1]].attackStrength = _randomAttackStrengthPlayer2;
    gameTokens[_battle.playerTokenIds[1]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - _randomAttackStrengthPlayer2;
}

    function updateBattle(string memory _name, Battle memory _newBattle) private {
        require(isBattle(_name), "Battle doesn't exist");
        battles[battleInfo[_name]] = _newBattle;
    }

    function getPlayerTokens(address addr) public view returns (GameToken[] memory) {
        require(isPlayerToken(addr), "Game token doesn't exist!");
        uint256[] memory tokenIds = playerTokenInfo[addr];
        GameToken[] memory tokens = new GameToken[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokens[i] = gameTokens[tokenIds[i]];
        }
        return tokens;
    }

function quitBattle(string memory _battleName) public {
    Battle memory _battle = getBattle(_battleName);
    require(_battle.players[0] == msg.sender || _battle.players[1] == msg.sender, "You are not in this battle!");

    _battle.players[0] == msg.sender ? _endBattle(_battle.players[1], _battle) : _endBattle(_battle.players[0], _battle);
  }

  function _endBattle(address battleEnder, Battle memory _battle) internal returns (Battle memory) {
    require(_battle.battleStatus != BattleStatus.ENDED, "Battle already ended"); // Require that battle has not ended

    _battle.battleStatus = BattleStatus.ENDED;
    _battle.winner = battleEnder;
    updateBattle(_battle.name, _battle);

    uint p1 = playerInfo[_battle.players[0]];
    uint p2 = playerInfo[_battle.players[1]];

    players[p1].inBattle = false;
    players[p1].playerHealth = 25;
    players[p1].playerMana = 10;

    players[p2].inBattle = false;
    players[p2].playerHealth = 25;
    players[p2].playerMana = 10;

    address _battleLoser = battleEnder == _battle.players[0] ? _battle.players[1] : _battle.players[0];

    emit BattleEnded(_battle.name, battleEnder, _battleLoser); // Emits BattleEnded event

    return _battle;
  }

    function _transferTokenToWinner(address winner, address loser, uint256 tokenId) internal {
        require(balanceOf(loser, tokenId) > 0, "Loser does not own the token");

        uint256[] storage loserTokens = playerTokenInfo[loser];
        uint256[] storage winnerTokens = playerTokenInfo[winner];

        for (uint256 i = 0; i < loserTokens.length; i++) {
            if (loserTokens[i] == tokenId) {
                loserTokens[i] = loserTokens[loserTokens.length - 1];
                loserTokens.pop();
                break;
            }
        }
        winnerTokens.push(tokenId);

        // safeTransferFrom(loser, winner, tokenId, 1, "");
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(baseURI, "/", uintToStr(tokenId), ".json"));
    }

    function resetData() external onlyOwner {
        delete players;
        delete gameTokens;
        delete battles;

        for (uint256 i = 0; i < players.length; i++) {
            delete playerTokenInfo[players[i].playerAddress];
        }
        for (uint256 i = 0; i < battles.length; i++) {
            delete battleInfo[battles[i].name];
        }

        totalSupply = 0;

        initialize();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uintToStr(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}