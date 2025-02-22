import { ethers } from "ethers";

import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";
import { defenseSound } from "../assets";

const AddNewEvent=(eventFilter,provider,cb)=>{
  provider.removeListener(eventFilter);

  provider.on(eventFilter,(logs)=>{
    const parseLog=(new ethers.utils.Interface(ABI)).parseLog(logs);
    cb(parseLog);
  })
}
const emptyAccount = '0x0000000000000000000000000000000000000000';

const getCoords=(cardRef)=>{
  const {left,top,width,height}=cardRef.current.getBoundingClientRect()
  return {
    pageX:left+width/2,
    pageY:top+height/2.25};
}


export const createEventListener=({navigate,contract,provider,walletAddress,setShowAlert,setUpdateGameData,player1Ref,player2Ref})=>{
  const NewPlayerEventFilter=contract.filters.NewPlayer();
  AddNewEvent(NewPlayerEventFilter,provider,({args})=>{
    console.log('New Player Created',args);
    if(walletAddress===args.owner){
      setShowAlert({
        status:true,
        type:'success',
        message:'Player has been Successfully registered.',
      })
    }

  })

  const newGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(newGameTokenEventFilter, provider, ({ args }) => {
    console.log('New Game Token is created!',args);
    if (walletAddress===args.owner) {
      setShowAlert({
        status:true,
        type:'success',
        message:'Player game token has been successfully created'
      })
    }

  })
  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log('New battle started!', args, walletAddress);
console.log(walletAddress);

    if (walletAddress === args.player1 || walletAddress=== args.player2) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  const BattleMoveEventFilter=contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter,provider,({args})=>{
    console.log('Battle move initiated!',args);
  })

  const RoundEndedFilter=contract.filters.RoundEnded();
  AddNewEvent(RoundEndedFilter,provider,({args})=>{
    console.log('Round ended!',args,walletAddress);
    for (let i = 0; i < args.damagedPlayers.length; i+=1) {
      if(args.damagedPlayers[i] !== emptyAccount){
        if(args.damagedPlayers[i] !== walletAddress){
          sparcle(getCoords(player1Ref));
        }
        if (args.damagedPlayers[i] !==walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      }else{
        playAudio(defenseSound)
      }
    }
    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  })

  const BattleEndedEventFilter=contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter,provider,({args})=>{
    console.log('Battle Ended!',args,walletAddress);
    if(walletAddress===args.winner){
      setShowAlert({status:true,type:'success',message:'You won!'})
    }else if(walletAddress===args.loser){
      setShowAlert({status:true,type:'failure',message:'You lost!'})
    }
    navigate('/create-battle')
  })
}