import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from '../styles';

const healthPoints = 25;
const healthLevel = (points) =>
  points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500';
const marginIndexing = (index) => (index !== healthPoints - 1 ? 'mr-1' : 'mr-0');

const PlayerInfo = ({ player, playerIcon, mt }) => {
  return (
    <div className={`${styles.flexCenter} ${mt ? 'mt-4' : 'mb-4'} `}>
      {/* Player Icon */}
      <img
        data-tooltip-id={`Player-${mt ? '1' : '2'}`}
        data-tooltip-html={`
          <p>
            <span style="font-weight: bold;">Name: </span> ${player?.playerName}
          </p>
          <p>
            <span style="font-weight: bold;">Address: </span> ${player?.playerAddress?.slice(0, 10)}
          </p>
        `}
        src={playerIcon}
        alt="player2"
        className="w-14 h-14 object-contain rounded-full"
      />

      {/* Player Health */}
      <div
        data-tooltip-id={`Health-${mt ? '1' : '2'}`}
        data-tooltip-html={`
          <p>
            <span style="font-weight: bold;">Health: </span>  ${player?.health}
          </p>`}
        className={styles.playerHealth}
      >
        {[...Array(player.health).keys()].map((item, index) => (
          <div
            key={`player-item-${item}`}
            className={`${styles.playerHealthBar} ${healthLevel(player.health)} ${marginIndexing(index)} `}
          />
        ))}
      </div>

      {/* Player Mana */}
      <div
        data-tooltip-id={`Mana-${mt ? '1' : '2'}`}
        data-tooltip-html={`
          <p>
            <span style="font-weight: bold;">Mana </span>
          </p>`}
        className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana} `}
      >
        {player.mana || 0}
      </div>

      {/* Tooltips */}
      <ReactTooltip id={`Player-${mt ? '1' : '2'}`} effect="solid" style={{ backgroundColor: '#9e1e22', color: '#fff', fontFamily:"Rajdhani",fontWeight:"500",zIndex:"1000"}}/>
      <ReactTooltip id={`Health-${mt ? '1' : '2'}`} effect="solid" style={{ backgroundColor: '#9e1e22', color: '#fff', fontFamily:"Rajdhani",fontWeight:"500",zIndex:"1000" }} />
      <ReactTooltip id={`Mana-${mt ? '1' : '2'}`} effect="solid" style={{ backgroundColor: '#9e1e22', color: '#fff', fontFamily:"Rajdhani",fontWeight:"500",zIndex:"1000" }} />
    </div>
  );
};

export default PlayerInfo;
