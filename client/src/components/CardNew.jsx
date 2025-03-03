import React from "react";
import Tilt from "react-parallax-tilt";
import styles from "../styles";
import { allCards } from "../assets";

const CardNew = ( Card ) => {
  const card=Card.card;
  let img
  img = allCards[card.tokenHash ? card.tokenHash%30 : 0];
  console.log(card.tokenHash);

  return (
    <Tilt>
      <div className="sm:w-[234px] w-[99px] sm:h-[300px] h-[126px] z-0 transition-all">
        <img src={img} alt="card" className={styles.cardImg} />

        <div className={`absolute sm:w-[40px] w-[16px] sm:h-[40px] h-[16px] rounded-[25px] bottom-[30.5%] sm:bottom-[30%] sm:left-[21%] left-[22%] ${styles.flexCenter}`}>
          <p className="font-rajdhani text-[10px] sm:text-[30px] font-bold text-yellow-400">
            {card.attackStrength}
          </p>
        </div>

        <div className={`absolute sm:w-[40px] w-[16px] sm:h-[40px] h-[16px] rounded-[25px] bottom-[30.5%] sm:bottom-[30%] right-[13.5%] sm:right-[13%] ${styles.flexCenter}`}>
          <p className="font-rajdhani text-[10px] sm:text-[30px] font-bold text-red-400">
            {card.defenseStrength}
          </p>
        </div>
      </div>
    </Tilt>
  );
};

export default CardNew;
