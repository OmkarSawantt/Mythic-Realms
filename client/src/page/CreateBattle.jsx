import React,{useState,useEffect} from 'react';
import { PageHOC, CustomButton, CustomInputs , GameLoad, CardNew } from "../components";

import styles from "../styles";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';
import { ethers } from "ethers";
import {allCards} from '../assets'
const CreateBattle = () => {
  const {contract,walletAddress, battleName,setBattleName,gameData,setErrorMessage,setLoading,tokens,setShowAlert}=useGlobalContext()
  const [waitBattle, setWaitBattle] = useState(false);
  const navigate=useNavigate()
  const [selectedToken, setSelectedToken] = useState(null)
  const [selectedTokenHash, setSelectedTokenHash] = useState()
  const [showModal, setShowModal] = useState(false)
  let formattedTokens = tokens.map((token) => ({
      ...token,
      attackStrength: ethers.BigNumber.from(token.attackStrength).toNumber(),
      defenseStrength: ethers.BigNumber.from(token.defenseStrength).toNumber(),
      id: ethers.BigNumber.from(token.id).toNumber(),
      tokenHash: ethers.BigNumber.from(token.tokenHash).toNumber(),
    }));
  // let formattedTokens=[]
  useEffect(() => {
    if(tokens.length===1){
      setSelectedToken(0)
    }
    setLoading(true)
    if(gameData?.activeBattle?.battleStatus===0){
      setWaitBattle(true)
    }
    setWaitBattle(false)
    setLoading(false)
  }, [gameData,tokens])


  const handleClick=async()=>{
    if(!battleName || !battleName.trim() ) return null;
    if(selectedToken===null) {
      setShowAlert({
        status:true,
        type:'failure',
        message:`Select card to create battle`
      })
    }
    try {
      await contract.createBattle(battleName,tokens[selectedToken].id,{gasLimit:200000});
      setWaitBattle(true)
    } catch (error) {
      setErrorMessage(error);
      console.log(error);

    }
  }
  // const handleClick2=async () => {
  //   if(contract){
  //     await contract.resetData()
  //   }
  // }
  return (
    <>
    {
      waitBattle && <GameLoad/>
    }
      <div className='flex flex-col mb-5'>
        <CustomInputs
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <p className="font-rajdhani font-light text-sm text-white">
          {selectedToken === null ? 'Card not selected' : `Selected card: ${allCards[selectedTokenHash].split('/').pop().split('.')[0] || 'Card'}`}
        </p>
        <div className='w-full flex justify-left gap-8'>

          <CustomButton
            title="Create Battle"
            handleClick={handleClick}
            restStyles={`mt-6 ${formattedTokens.length<1 && 'cursor-not-allowed'}`}
          />
          <CustomButton
            title="Select Card"
            handleClick={()=>setShowModal(true)}
            restStyles={`mt-6 ${formattedTokens.length<=1 && 'hidden'}`}
          />
        </div>
      </div>

      {
        formattedTokens.length<1
          ? <p className="font-rajdhani font-medium text-lg text-white">No cards available, <span className='text-[#9e1e22] cursor-pointer' onClick={()=>navigate('/tokens')}>Create New Card </span></p>
          : <p className={styles.infoText} onClick={()=>navigate('/join-battle')}>Or join already existing battles</p>
      }
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-5 rounded-lg text-white w-3/6">
            <h2 className="text-lg font-bold mb-3">Select a Token</h2>
            <div className="flex flex-row max-h-screen overflow-auto gap-2">
              {formattedTokens.map((token,index) => (
                <div key={index}>
                <button
                  onClick={() => {
                    setSelectedToken(index);
                    setSelectedTokenHash(token.tokenHash);
                    setShowModal(false);
                  }}
                  className="p-2 rounded-md"
                  >
                  <CardNew card={token}/>
                </button>
                  </div>
              ))}
                          </div>
            <button onClick={() => setShowModal(false)} className="mt-4 p-2 bg-red-600 rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
};

export default PageHOC(
  CreateBattle,
  <>Create<br/>a new Battle</>,
  <>Connect Your own battle and wait for other players to join you</>
);