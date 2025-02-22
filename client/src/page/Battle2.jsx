import React, { useEffect, useState } from 'react'
import styles from '../styles'
import Sword from '../components/Sword'

const Battle2 = () => {
  const [showSword,setShowsword]=useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowsword(false);
    }, 6000); // Hide tags after 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <div className={`${styles.flexCenter} ${styles.gameContainer} bg-bat`}>
      {
        showSword &&
        <div className='absolute h-screen w-full flex justify-center items-center bg-[#0f101e] bg-opacity-90'>
          <Sword />
        </div>
      }

    </div>
  )
}

export default Battle2