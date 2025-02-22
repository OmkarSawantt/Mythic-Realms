import React from 'react'
import { useNavigate } from "react-router-dom";
import { logo,heroImg } from "../assets";
import Group2 from '../assets/Group2.svg'
import styles from '../styles'
import Home from '../assets/background/bg2.png'
import { useGlobalContext } from "../context";
import Alert from './Alert';
import CustomButton from './CustomButton';
import Loader from './Loader'
import dragon1 from '../assets/background/dragon1.png'
const PageHOC = (Components, title1, description1) =>()=> {
  const { showAlert,title,description,registered,loading,player,walletAddress } =useGlobalContext()
  const navigate = useNavigate();

  return (
    <div className={styles.hocContainer}>
      {
        showAlert?.status && <Alert type={showAlert.type} message={showAlert.message}/>
      }
      <div className={styles.hocContentBox}>
        <div className='w-full flex flex-row justify-between items-center'>
          <img src={Group2} alt="logo" className={styles.hocLogo} onClick={() => navigate('/')} />
          {
            registered && (
              <>
              <button onClick={()=>navigate('/my-account')} className='button1 px-8 py-2 hidden sm:block'>
                {player.playerName}({walletAddress.substring(0,5)}...{walletAddress.substring(walletAddress.length-4,walletAddress.length)})
              </button>
              <button onClick={()=>navigate('/my-account')} className='button1 px-2 py-1 block sm:hidden'>
                {player.playerName}
              </button>
              </>
            )
          }
        </div>
        <div className={styles.hocBodyWrapper}>
          <div className='flex flex-row w-full'>
            <h1 className={`flex ${styles.headText} head-text`}>{title1!==undefined ? title1 : title}</h1>
          </div>
          <p className={`${styles.normalText} my-10`}>{description1!==undefined ? description1 : description}</p>
          <Components/>
        </div>
      </div>
      <div className='flex flex-1'>
        <img src={Home} alt="heroImg" className='w-full xl:h-full object-cover'/>
      </div>
      {
        loading && (
          <div className={`${styles.gameLoadContainer} flex justify-center items-center`}>
            <Loader/>
          </div>
        )
      }
    </div>
  );
}
export default PageHOC