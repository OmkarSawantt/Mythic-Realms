import React, { useEffect, useState } from 'react';
import { PageHOC, CustomInputs, CustomButton} from "../components";
import { useGlobalContext } from "../context";
import { useNavigate } from 'react-router-dom';
import styles from '../styles';
import sword  from "../assets/sword-90_256.gif";
import { allCards } from "../assets";
const Home = () => {
  const {contract,walletAddress,setShowAlert,setTitle,setDescription,registered ,setRegistered,setErrorMessage , setLoading}=useGlobalContext()
  const [playerName, setPlayerName] = useState('')
  const navigate=useNavigate()
  const handleClick=async () => {
    try {
      const playerExists=await contract.isPlayer(walletAddress);
      if(!playerExists){
        setLoading(true)
        await contract.registerPlayer(playerName);
        setShowAlert({
          status:true,
          type:'info',
          message:`${playerName} is being summoned!`
        })
      }
    } catch (error) {
      setShowAlert({
        status:true,
        type:'failure',
        message:`Something went wrong!`
      })
      console.log(error);

    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    const checkForPlayerToken = async () => {
      setLoading(true)
      if (!contract || !walletAddress) {
        setTitle(<>Welcome to Mythic Realms! <br/>Where Legends Are Born</>)
        setDescription(<>Connect your wallet to unleash your powers, <br/>and claim your place in the Web3 battleground!</>)
        return
      };
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        // const playerTokenExists = await contract.isPlayerToken(walletAddress);
        if (playerExists ){
          const player=await contract.getPlayer(walletAddress);
          setRegistered(true)
          // const tokens=await contract.getAllPlayerTokens()
          // const uri=await contract.tokenURI(tokens[1].id)
          // console.log(uri);
          setTitle(<>Welcome Back,{player.playerName} <br/>Step into the Mythic Realms</>)
          setDescription(<>Your journey continues. Create a new battle or join forces with others.<br/>Good luck in the arena!</>)
        }else{
          setTitle(<>Welcome to Mythic Realms! <br/>Where Legends Are Born</>)
          setDescription(<>Connect your wallet to unleash your powers, <br/>and claim your place in the Web3 battleground!</>)
        }
      } catch (error) {
        setErrorMessage(error)
      }finally{
        setLoading(false)
      }
    };
    checkForPlayerToken();

  }, [contract,walletAddress])

  return (
    <div>
      {
        registered ? (
          <>
              <button onClick={()=>navigate('/create-battle')} className="button">
                 Fight Now
                 <img src={sword} alt="loader" className='icon'/>
              </button>
          </>
        ) : (
          <>
           <h2 className={styles.label}>Register to Join the Battle</h2>
            <CustomInputs
              label="Name"
              placeholder="Enter your player name"
              value={playerName}
              handleValueChange={setPlayerName}
            />
            <CustomButton
              title='Register'
              handleClick={handleClick}
              restStyles='mt-6'
            />
          </>
        )
      }
    </div>
  )
};

export default PageHOC(
  Home,
);