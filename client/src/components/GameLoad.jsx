import React,{useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import CustomButton from './CustomButton'
import { useGlobalContext } from "../context";
import { player01,player02 } from "../assets";
import explo from '../assets/explo.gif'
import fx from '../assets/fx_energy_by_iraefremova_ddhpije.gif'
import styles from '../styles'
const GameLoad = () => {
  const navigate = useNavigate();
  const {walletAddress,contract,setLoading}=useGlobalContext()
  const [name, setName] = useState()
  useEffect(() => {
    const getPLayer=async()=>{
      setLoading(true)
      const player=await contract.getPlayer(walletAddress ,{gasLimit:200000});
      setName(player.playerName)
      setLoading(false)
    }
    getPLayer()
  }, [walletAddress,contract])

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer} absolute w-full`}>
      <div className='absolute h-full w-full -z-10 flex justify-center items-center'>
        <img src={explo} alt="bg" className='h-full object-cover w-full brightness-50 opacity-50 '/>
      </div>
      <div className={styles.gameLoadBtnBox}>
      </div>
      <div className={`flex-1 ${styles.flexCenter} flex-col`}>
        <h1 className={`${styles.headText} text-center`}>Waiting for a<br/>worth opponent...</h1>
        <p className={styles.gameLoadText}>
        Preparing the battlefield...
        </p>
        <div className={styles.gameLoadPlayersBox}>
          <div className={`${styles.flexCenter} flex-col`} >
            <img src={player01} className={styles.gameLoadPlayerImg}/>
            <p className={styles.gameLoadPlayerText} >{name}</p>
          </div>

          <h2 className={styles.gameLoadVS}>VS</h2>

          <div className={`${styles.flexCenter} flex-col`} >
            <img src={player02} className={styles.gameLoadPlayerImg}/>
            <p className={styles.gameLoadPlayerText} >{ name && ('?'.repeat(name.length))} </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default GameLoad