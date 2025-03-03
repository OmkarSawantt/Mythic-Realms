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

        _mint(msg.sender, tokenIdCounter, 1, "");

        tokenIdCounter++;
        totalSupply++;
        emit NewGameToken(msg.sender, tokenIdCounter - 1, randAttackStrength, randDefenseStrength);
        return newGameToken;
    }

    function _createRandomNum(uint256 _max, address _sender) internal view returns (uint256 randomValue) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, _sender)));
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
        battles[battleInfo[_battleName]].moves[_player] = _choice;
    }

    function attackOrDefendChoice(uint8 _choice, string memory _battleName) external {
        Battle memory _battle = getBattle(_battleName);

        require(
            _battle.battleStatus == BattleStatus.STARTED,
            "Battle not started. Please tell another player to join the battle"
        );
        require(
            _battle.battleStatus != BattleStatus.ENDED,
            "Battle has already ended"
        );
        require(
            msg.sender == _battle.players[0] || msg.sender == _battle.players[1],
            "You are not in this battle"
        );

        // Get player indices
        uint256 playerIndex = playerInfo[msg.sender];
        uint256 playerPosition = _battle.players[0] == msg.sender ? 0 : 1;
        uint256 opponentPosition = playerPosition == 0 ? 1 : 0;
        address opponent = _battle.players[opponentPosition];
        uint256 opponentIndex = playerInfo[opponent];

        // Check if current player has health
        require(players[playerIndex].playerHealth > 0, "Cannot make a move with zero health");

        // Check if opponent has zero health, if so, end battle
        if (players[opponentIndex].playerHealth == 0) {
            _endBattle(msg.sender, _battleName);
            return;
        }

        // Check if player has already made a move
        require(_battle.moves[playerPosition] == 0, "You have already made a move!");

        // Check if player has enough mana for attacking
        require(_choice == 1 ? players[playerIndex].playerMana >= 3 : true, "Mana not sufficient for attacking!");

        // Register player's move
        _registerPlayerMove(playerPosition, _choice, _battleName);

        // Get updated battle state
        _battle = getBattle(_battleName);
        uint _movesLeft = 2 - (_battle.moves[0] == 0 ? 0 : 1) - (_battle.moves[1] == 0 ? 0 : 1);
        emit BattleMove(_battleName, _movesLeft == 1 ? true : false);

        // If both players have made moves, resolve the battle round
        if (_movesLeft == 0) {
            _resolveBattle(_battleName);
        }
    }

    // SIMPLIFIED BATTLE RESOLUTION FUNCTION
    function _resolveBattle(string memory _battleName) internal {
        uint256 battleIndex = battleInfo[_battleName];
        Battle storage battle = battles[battleIndex];

        // If battle already ended, return
        if (battle.battleStatus == BattleStatus.ENDED) {
            return;
        }

        uint256 p1Index = playerInfo[battle.players[0]];
        uint256 p2Index = playerInfo[battle.players[1]];

        // Check if any player has zero health before starting
        if (players[p1Index].playerHealth == 0) {
            _endBattle(battle.players[1], _battleName);
            return;
        } else if (players[p2Index].playerHealth == 0) {
            _endBattle(battle.players[0], _battleName);
            return;
        }

        GameToken memory p1Token = getPlayerTokenById(battle.players[0], battle.playerTokenIds[0]);
        GameToken memory p2Token = getPlayerTokenById(battle.players[1], battle.playerTokenIds[1]);

        address[2] memory damagedPlayers = [address(0), address(0)];

        // Process battle moves
        if (battle.moves[0] == 1 && battle.moves[1] == 1) {
            // Both attack
            players[p1Index].playerMana -= 3;
            players[p2Index].playerMana -= 3;

            // Apply damage to both players
            if (players[p1Index].playerHealth <= p2Token.attackStrength) {
                players[p1Index].playerHealth = 0;
                damagedPlayers[0] = battle.players[0];
            } else {
                players[p1Index].playerHealth -= p2Token.attackStrength;
                damagedPlayers[0] = battle.players[0];
            }

            if (players[p2Index].playerHealth <= p1Token.attackStrength) {
                players[p2Index].playerHealth = 0;
                damagedPlayers[1] = battle.players[1];
            } else {
                players[p2Index].playerHealth -= p1Token.attackStrength;
                damagedPlayers[1] = battle.players[1];
            }

            // Check if anyone died and end battle if necessary
            if (players[p1Index].playerHealth == 0 && players[p2Index].playerHealth == 0) {
                // Both died - winner is one with higher attack strength
                if (p1Token.attackStrength >= p2Token.attackStrength) {
                    _endBattle(battle.players[0], _battleName);
                } else {
                    _endBattle(battle.players[1], _battleName);
                }
                return;
            } else if (players[p1Index].playerHealth == 0) {
                _endBattle(battle.players[1], _battleName);
                return;
            } else if (players[p2Index].playerHealth == 0) {
                _endBattle(battle.players[0], _battleName);
                return;
            }
        }
        else if (battle.moves[0] == 1 && battle.moves[1] == 2) {
            // Player 1 attacks, Player 2 defends
            players[p1Index].playerMana -= 3;
            players[p2Index].playerMana += 3;

            // Calculate damage after defense
            uint256 damage = 0;
            if (p1Token.attackStrength > p2Token.defenseStrength) {
                damage = p1Token.attackStrength - p2Token.defenseStrength;
            }

            // Apply damage
            if (damage >= players[p2Index].playerHealth) {
                players[p2Index].playerHealth = 0;
                damagedPlayers[1] = battle.players[1];
                _endBattle(battle.players[0], _battleName);
                return;
            } else if (damage > 0) {
                players[p2Index].playerHealth -= damage;
                damagedPlayers[1] = battle.players[1];
            }
        }
        else if (battle.moves[0] == 2 && battle.moves[1] == 1) {
            // Player 1 defends, Player 2 attacks
            players[p1Index].playerMana += 3;
            players[p2Index].playerMana -= 3;

            // Calculate damage after defense
            uint256 damage = 0;
            if (p2Token.attackStrength > p1Token.defenseStrength) {
                damage = p2Token.attackStrength - p1Token.defenseStrength;
            }

            // Apply damage
            if (damage >= players[p1Index].playerHealth) {
                players[p1Index].playerHealth = 0;
                damagedPlayers[0] = battle.players[0];
                _endBattle(battle.players[1], _battleName);
                return;
            } else if (damage > 0) {
                players[p1Index].playerHealth -= damage;
                damagedPlayers[0] = battle.players[0];
            }
        }
        else if (battle.moves[0] == 2 && battle.moves[1] == 2) {
            // Both defend
            players[p1Index].playerMana += 3;
            players[p2Index].playerMana += 3;
            // No damage to either player
        }

        // If battle is still going, reset moves for next round
        if (battle.battleStatus != BattleStatus.ENDED) {
            emit RoundEnded(damagedPlayers);
            battle.moves[0] = 0;
            battle.moves[1] = 0;

            // Update token strengths for next round
            uint256 newAttackP1 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, battle.players[0]);
            gameTokens[battle.playerTokenIds[0]].attackStrength = newAttackP1;
            gameTokens[battle.playerTokenIds[0]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - newAttackP1;

            uint256 newAttackP2 = _createRandomNum(MAX_ATTACK_DEFEND_STRENGTH, battle.players[1]);
            gameTokens[battle.playerTokenIds[1]].attackStrength = newAttackP2;
            gameTokens[battle.playerTokenIds[1]].defenseStrength = MAX_ATTACK_DEFEND_STRENGTH - newAttackP2;
        }
    }

    // SIMPLIFIED BATTLE ENDING FUNCTION
    function _endBattle(address winner, string memory _battleName) internal {
        uint256 battleIndex = battleInfo[_battleName];
        Battle storage battle = battles[battleIndex];

        // Ensure battle hasn't already ended
        if (battle.battleStatus == BattleStatus.ENDED) {
            return;
        }

        // Set battle as ended and record winner
        battle.battleStatus = BattleStatus.ENDED;
        battle.winner = winner;

        // Determine loser
        address loser = winner == battle.players[0] ? battle.players[1] : battle.players[0];
        uint256 loserTokenId = winner == battle.players[0] ? battle.playerTokenIds[1] : battle.playerTokenIds[0];

        // Reset player states
        uint256 p1Index = playerInfo[battle.players[0]];
        uint256 p2Index = playerInfo[battle.players[1]];

        players[p1Index].inBattle = false;
        players[p1Index].playerHealth = 25;
        players[p1Index].playerMana = 10;

        players[p2Index].inBattle = false;
        players[p2Index].playerHealth = 25;
        players[p2Index].playerMana = 10;

        // Directly transfer the token from loser to winner
        _transferTokenDirectly(winner, loser, loserTokenId);

        emit BattleEnded(_battleName, winner, loser);
    }

    function quitBattle(string memory _battleName) public nonReentrant {
        Battle memory _battle = getBattle(_battleName);
        require(_battle.players[0] == msg.sender || _battle.players[1] == msg.sender, "You are not in this battle!");

        address winner = _battle.players[0] == msg.sender ? _battle.players[1] : _battle.players[0];
        _endBattle(winner, _battleName);
    }

    // SIMPLIFIED TOKEN TRANSFER FUNCTION
    function _transferTokenDirectly(address winner, address loser, uint256 tokenId) internal {
        // Update player token mappings
        uint256[] storage loserTokens = playerTokenInfo[loser];
        uint256[] storage winnerTokens = playerTokenInfo[winner];

        // Remove token from loser's array
        for (uint256 i = 0; i < loserTokens.length; i++) {
            if (loserTokens[i] == tokenId) {
                loserTokens[i] = loserTokens[loserTokens.length - 1];
                loserTokens.pop();
                break;
            }
        }

        // Add token to winner's array
        winnerTokens.push(tokenId);

        // Update token ownership in the ERC1155 contract
        // Instead of safeTransferFrom, manually adjust balances
        _safeTransferFrom(loser, winner, tokenId, 1, "");
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

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(baseURI, "/", uintToStr(tokenId), ".json"));
    }

    function resetData() external onlyOwner {
        for (uint i = 1; i < players.length; i++) {
            address playerAddr = players[i].playerAddress;
            if (playerAddr != address(0)) {
                delete playerTokenInfo[playerAddr];
                delete playerInfo[playerAddr];
            }
        }

        for (uint i = 1; i < battles.length; i++) {
            delete battleInfo[battles[i].name];
        }

        delete players;
        delete gameTokens;
        delete battles;

        tokenIdCounter = 1;
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