import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import CustomButton from './CustomButton'
import { useGlobalContext } from "../context";
import { alertIcon,gameRules } from "../assets";
import styles from '../styles'
import BattleGround from './BattleGround'
const GameInfo = () => {
  const navigate = useNavigate();
  const {contract,gameData,setShowAlert,setErrorMessage}=useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState()
  const [toggleChangeBattleGround, setToggleChangeBattleGround] = useState(false)
  const handleBattleExit=async()=>{
    const battleName=gameData.activeBattle.name;
    try {
      const a=await contract.quitBattle(battleName,{gasLimit:200000})
      console.log(a);
      setShowAlert({status:true,type:'info',message:`You're quitting the ${battleName}`})
    } catch (error) {
      setErrorMessage(error)
      console.log(error);

    }
  }
  const onClose=async () => {
    setToggleChangeBattleGround(false)
  }
  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <button className={`${styles.gameInfoIcon} ${styles.flexCenter}`} onClick={() => setToggleSidebar(true)}        >
          <img src={alertIcon} alt='info' className={styles.gameInfoIconImg} />
        </button>
      </div>

      <div className={`${styles.gameInfoSidebar} ${toggleSidebar ? 'translate-x-0 ' : 'translate-x-full hidden'} ${styles.glassEffect}  backdrop-blur-3xl overflow-hidden`}>
        <div className='flex flex-col'>
          <div className={styles.gameInfoSidebarCloseBox}>
            <div className={`${styles.gameInfoSidebarClose} ${styles.flexCenter}`} onClick={()=>setToggleSidebar(false)} >
              X
            </div>
          </div>
          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>
          <div className='mt-3'>
            {gameRules.map((rule,index)=>(
              <p key={`game-rule-${index}`} className={styles.gameInfoText}><span className='font-bold'>{index+1}</span>. {rule}</p>
            ))}
          </div>
        </div>
        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
            <CustomButton title="Exit Battle" handleClick={()=>handleBattleExit()}/>
        </div>
      </div>
    </>
  )
}

export default GameInfo