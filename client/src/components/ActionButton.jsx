import React from 'react'
import styles from '../styles'
import { Tooltip as ReactTooltip } from 'react-tooltip';
const ActionButton = ({imgUrl,handleClick,restStyles,type}) => {
  return (
    <div className={`${styles.gameMoveBox} ${styles.flexCenter} ${styles.glassEffect} ${restStyles}`} onClick={handleClick}
    data-tooltip-id={`Button`}
    data-tooltip-html={`
      <p>
        <span style="font-weight: bold;"> ${type} </span>
      </p>
    `}>
      <img src={imgUrl} alt="action_img" className={styles.gameMoveIcon} />
            <ReactTooltip id={`Button`} effect="solid" style={{ backgroundColor: '#9e1e22', color: '#fff', fontFamily:"Rajdhani",fontWeight:"500"}}/>
    </div>
  )
}

export default ActionButton