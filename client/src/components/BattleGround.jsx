import React from 'react'
import styles from '../styles'

import Tilt from 'react-parallax-tilt'
import { battlegrounds } from "../assets";
import { useGlobalContext } from '../context';
const BattleGround = ({onClose}) => {
  const {setBattleGround,setShowAlert}=useGlobalContext();
  const handleBattleGroundChoice= (ground) => {
    setBattleGround(ground.id)
    localStorage.setItem('battleground',ground.id)
    setShowAlert({status:true,type:'info', message:`${ground.name} is battle ready!`})
    onClose()
  }
  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer} w-full absolute h-screen `}>
      <div className='absolute right-10 top-10'>
        <div className={`${styles.gameInfoSidebarClose} ${styles.flexCenter}`} onClick={onClose} >
          X
        </div>
      </div>
      <div >
        <h1 className={`${styles.headText} text-center  `}>Choose your <span className='text-[#f2843c]'>Battle</span> Ground</h1>
        <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper} sm:overflow-hidden overflow-auto` }>
          {
            battlegrounds.map((ground)=>(
              <div key={ground.id} className={`${styles.flexCenter} ${styles.battleGroundCard}`} onClick={()=>handleBattleGroundChoice(ground)}>
                <img src={ground.image} alt="ground" className={styles.battleGroundCardImg} onClick={()=>handleBattleGroundChoice(ground)}/>
                <div className='info absolute' ><p className={styles.battleGroundCardText}>{ground.name}</p></div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default BattleGround