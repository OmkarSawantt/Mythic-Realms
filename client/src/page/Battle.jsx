import React,{useEffect, useState} from 'react'
import { useParams ,useNavigate } from "react-router-dom";
import styles from '../styles'
import { Alert,ActionButton,Card,GameInfo,PlayerInfo } from "../components";
import { useGlobalContext } from "../context";
import { attack,attackSound,defense,defenseSound,player01 as player01Icon,player02 as player02Icon } from "../assets";
import { playAudio } from "../utils/animation";
import Sword from '../components/Sword'
const Battle = () => {
  const {contract,gameData,walletAddress,showAlert,setShowAlert,updateGameData,battleGround,setErrorMessage,player1Ref,player2Ref}=useGlobalContext()
  const [player01, setPlayer01] = useState({})
  const [player02, setPlayer02] = useState({})
  const [showSword,setShowsword]=useState(true)
  const [p1TokenHah, setP1TokenHah] = useState()
  const [p2TokenHah, setP2TokenHah] = useState()
  const {battleName}=useParams()
  const navigate = useNavigate()
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowsword(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);
  console.log(gameData.activeBattle);

  useEffect(() => {
    const getPlayerInfo=async () => {

      try {
        let player01Address=null;
        let player02Address=null;
        let player01tokenId=null;
        let player02tokenId=null;


        if(gameData.activeBattle.players[0]===walletAddress){
          console.log(await contract.getBattle(gameData.activeBattle.name));


          player01Address=gameData.activeBattle.players[0];
          player02Address=gameData.activeBattle.players[1];
          player01tokenId=gameData.activeBattle.playerTokenIds[0]
          player02tokenId=gameData.activeBattle.playerTokenIds[1]
        }else{
          player01Address=gameData.activeBattle.players[1];
          player02Address=gameData.activeBattle.players[0];
          player01tokenId=gameData.activeBattle.playerTokenIds[1]
          player02tokenId=gameData.activeBattle.playerTokenIds[0]
        }


        const p1TokenData=await contract.getPlayerTokenById(player01Address,player01tokenId.toNumber())
        setP1TokenHah(p1TokenData.tokenHash.toNumber());

        const player1=await contract.getPlayer(player01Address)
        console.log(player02Address);

        const player2=await contract.getPlayer(player02Address)
        console.log("player2:",player2);

        const p2tokenHash=await contract.getPlayerTokenHash(player02Address,player02tokenId.toNumber())
        setP2TokenHah(p2tokenHash.toNumber());

        const p1Att=p1TokenData.attackStrength.toNumber()
        const p1Def=p1TokenData.defenseStrength.toNumber()
        const p1H=player1.playerHealth.toNumber();
        const p1M=player1.playerMana.toNumber();
        const p2H=player2.playerHealth.toNumber();
        const p2M=player2.playerMana.toNumber();


        setPlayer01({...player1,att:p1Att,def:p1Def,health:p1H,mana:p1M})
        setPlayer02({...player2,att:'X',def:'X',health:p2H,mana:p2M})
      } catch (error) {
        setErrorMessage(error);
        console.log(error);

      }
    }
    if(contract && gameData.activeBattle) getPlayerInfo()
  }, [contract,gameData,battleName,walletAddress])
  const makeAMove =async (choice) => {
    playAudio(choice===1?attackSound:defenseSound)
    try {
      await contract.attackOrDefendChoice(choice,battleName,{gasLimit:2000000})
      setShowAlert({
        status:true,
        type:'info',
        message:`Initiating ${choice===1?'attack':'defense'}`
      })
    } catch (error) {
      setErrorMessage(error);
    }
  }
   useEffect(()=>{
    const timer=setTimeout(() => {
     if(!gameData?.activeBattle){
      navigate('/')
     }
    },[2000]);
    return () => clearTimeout(timer);
   })
  return (
    <div className={`${styles.flexBetween} ${styles.gameContainer} bg-bat overflow-hidden`}>
      {
        showSword &&
        <div className='absolute h-screen w-full flex justify-center items-center z-50 bg-[#0f101e] bg-opacity-90'>
          <Sword />
        </div>
      }
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message}/>}
      <PlayerInfo player={player02} playerIcon={player02Icon} mt />
      <div className={`${styles.flexCenter} flex-col `}>
        <Card
          Card={player02}
          title={player02?.playerName}
          cardRef={player2Ref}
          hash={p2TokenHah}
          playerTwo
        />
        <div className='flex items-center flex-row'>
          <ActionButton
            imgUrl={attack}
            handleClick={()=>makeAMove(1)}
            restStyles="mr-2 hover:border-[#9e1e22]"
            type='Attack'
          />
          <Card
            Card={player01}
            title={player01?.playerName}
            cardRef={player1Ref}
            hash={p1TokenHah}
            restStyles="mt-3"
          />
          <ActionButton
            imgUrl={defense}
            handleClick={()=>makeAMove(2)}
            restStyles="ml-2 hover:border-[#9e1e22]"
            type='Defense'
          />
        </div>
      </div>

      <PlayerInfo player={player01} playerIcon={player01Icon}  />

      <GameInfo/>
    </div>
  )
}

export default Battle