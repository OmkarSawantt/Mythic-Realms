import React from 'react'
import Tilt from 'react-parallax-tilt'
import styles from '../styles'
import { allCards } from "../assets";
const generateRandomCardImage=()=>allCards[Math.floor(Math.random()*(allCards.length-1))]
const img1=generateRandomCardImage()
const img2=generateRandomCardImage()
const Card = ({Card,title,restStyle,cardRef,hash,playerTwo}) => {

  console.log(hash);

  return (
    <Tilt>

    <div ref={cardRef} className={`${styles.cardContainer} ${restStyle}`}>
      <img src={allCards[hash] } alt="card" className={styles.cardImg} />
      <div className={`${styles.cardPointContainer} sm:left-[25.5%] left-[26%] ${styles.flexCenter}]`}>
        <p className={`${styles.cardPoint} text-yellow-400`}>{Card.att}</p>
      </div>
      <div className={`${styles.cardPointContainer} right-[9.5%] sm:right-[8.5%]   ${styles.flexCenter}]`}>
        <p className={`${styles.cardPoint} text-red-400`}>{Card.def}</p>
      </div>
      <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
        <p className={styles.cardText}>{title}</p>
      </div>
    </div>
    </Tilt>
  )
}

export default Card