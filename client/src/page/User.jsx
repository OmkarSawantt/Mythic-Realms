import React,{useState,useEffect} from 'react';
import { PageHOC, CustomButton } from "../components";

import styles from "../styles";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';
import pencil from '../assets/pencil.svg'
const regex = /^[a-zA-Z0-9 ]*$/;
const User = () => {
  const {contract,walletAddress,setErrorMessage,setLoading,prevBattles,battleWon,tokens,player,setShowAlert}=useGlobalContext()
  const navigate=useNavigate()
  const [editNameBox, setEditNameBox] = useState(false)
  const [editName, setEditName] = useState()

  useEffect(() => {
    const RegistereOrNot=async()=>{
      setEditName(player.playerName)
      const playerExists=await contract.isPlayer(walletAddress);
      if(!playerExists){
        navigate('/')
      }
    }
    if(contract && walletAddress)RegistereOrNot()
  }, [contract,walletAddress,player])

  const handelSubmit=async()=>{
    try {
      if(editName!=='' && editName !==player.playerName){
        await contract.updatePlayerName(editName)
      }
      setShowAlert({status:true,type:'success',message:'Name Updated!'})
    } catch (error) {
      console.log(error);
      setShowAlert({status:true,type:'failure',message:'SomeThing Went Wrong!'})
    }finally{
      setEditNameBox(false)
      window.location.reload(false);
    }
  }
  return (
    <div className=''>
      <div className='border-b-2 border-[#9e1e22] py-4' >
        {
          editNameBox ?
            <>
            <div className='flex flex-row items-center justify-center' >
              <p className='font-rajdhani font-semibold text-4xl text-white text-center  '>Name:</p>
              <input type="text" value={editName} onChange={(e)=>{if(e.target.value==='' || regex.test(e.target.value)) setEditName(e.target.value)}}  className='bg-siteDimBlack text-white outline-none mx-2 focus:outline-[#9e1e22] p-4 rounded-md sm:w-[50%] w-full' />
            </div>
            <br />
            <div className='flex-row flex items-center justify-evenly'>
              <CustomButton title={'Submit'} handleClick={()=>{handelSubmit()}} restStyles={''} />
              <CustomButton title={'Cancel'} handleClick={()=>{setEditNameBox(false);setEditName(player.playerName)}} restStyles={''}/>
            </div>
            </>

          :
          <div className='flex flex-row items-center' >
            <p className='font-rajdhani font-semibold text-4xl text-white flex-1 text-center  '>Name: <span className='text-[#9e1e22]'> {player.playerName}</span></p>
            <button className="button_edit mx-auto " onClick={()=>setEditNameBox(true)}>
              <svg className="svg-icon" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g stroke="#9e1e22" strokeLinecap="round" strokeWidth="2"><path d="m20 20h-16"></path><path clipRule="evenodd" d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z" fillRule="evenodd"></path></g></svg>
              <span className="lable_edit hidden sm:block font-rajdhani">Edit</span>
            </button>
          </div>

        }
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center  sm:gap-6' >
        <p className='font-rajdhani font-semibold text-2xl text-white  sm:text-center'>Battles Played: <span className='text-[#9e1e22]'>{prevBattles.length}</span></p>
        <p className='font-rajdhani font-semibold text-2xl text-white  sm:text-center'>Win: <span className='text-[#9e1e22]'>{battleWon}</span></p>
        <p className='font-rajdhani font-semibold text-2xl text-white  sm:text-center'>Lost: <span className='text-[#9e1e22]'>{prevBattles.length-battleWon}</span></p>
        <div className='flex-1 flex sm:justify-end'>
        <CustomButton
          title="ViewAllBattle"
          handleClick={()=>navigate('/battle-history')}
          restStyles="my-2 mx-auto sm:mx-0 sm:ml-auto"
        />
        </div>
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-evenly'>
        <p className='font-rajdhani font-semibold text-2xl text-white  sm:text-center'>Cards Owned: <span className='text-[#9e1e22]'>{tokens.length}</span></p>
        <div className='flex-1 flex sm:justify-end'>

        <CustomButton
          title="ViewAllCards"
          handleClick={()=>navigate('/tokens')}
          restStyles="my-2 mx-auto sm:mx-0 sm:ml-auto"
          />
        </div>

      </div>
    </div>
  )
}

export default PageHOC(
  User,
  <>Welcome to Your Profile</>,
  <></>
);