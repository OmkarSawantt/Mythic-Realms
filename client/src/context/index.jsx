'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// INTERNAL IMPORTS
import { ABI, Address } from '../contract';
import { createEventListener } from './createEventListener';
import { useNavigate } from 'react-router-dom';
import { GetParams } from "../utils/onboard";
// Helper function to fetch the smart contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(Address, ABI, signerOrProvider);

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [player, setPlayer] = useState({});
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [battleName, setBattleName] = useState('')
  const [gameData, setGameData] = useState({
    players:[],pendingBattles:[],activeBattle:null
  })
  const [tokens,setTokens]=useState([])
  const [updateGameData,setUpdateGameData]=useState(0)
  const [battleGround, setBattleGround] = useState('bg-astral');
  const [prevBattles, setPrevBattles] = useState([])
  const [battleWon,setBattleWon]=useState(0)
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const navigate=useNavigate()
const [step, setStep] = useState(1)
const [registered, setRegistered] = useState(false)
const [loading, setLoading] = useState(false)
const player1Ref=useRef()
const player2Ref=useRef()
  useEffect(() => {
    const consfirsttleGroundFromLS=localStorage.getItem('battleground');

    if(consfirsttleGroundFromLS){
      setBattleGround(consfirsttleGroundFromLS)
    }else{
      localStorage.setItem('battleground','bg-astral')
    }
  }, [player1Ref])
  useEffect(() => {
    if(gameData.activeBattle){
      if (gameData.activeBattle?.battleStatus===0) {
        navigate('/create-battle')
      }else{
        navigate(`/battle/${gameData.activeBattle.name}`)
      }
    }
  }, [gameData])
  useEffect(() => {
    const registerdorNot=async()=>{
      const playerExists = await contract.isPlayer(walletAddress);
          if (playerExists ){
            setRegistered(true)
          }
    }
    if(walletAddress && contract)registerdorNot()
  }, [walletAddress,contract])

  // Function to connect wallet
  const connectWallet = async () => {
    if (isRequestPending) return;
    setIsRequestPending(true);

    try {
      const accounts = await window?.ethereum?.request({ method: 'eth_requestAccounts' });
      if (accounts) {
        setWalletAddress(accounts[0]);
        setShowAlert({ status: true, type: 'success', message: 'Wallet connected successfully!' });
      }
    } catch (error) {
      if (error.code === 4001) {
        setShowAlert({ status: true, type: 'failure', message: 'Wallet connection rejected!' });
      } else {
        setErrorMessage(error);
      }
    } finally {
      setIsRequestPending(false);
    }
  };

  // Function to initialize the contract and provider
  const initializeContract = async () => {
    const web3Modal = new Web3Modal();
    try {
      const connection = await web3Modal.connect();

      if (!window.ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask!');
      }

      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = fetchContract(signer);
      setProvider(newProvider);
      setContract(newContract);
    } catch (error) {
      if (error.code === 4001) {
        setShowAlert({ status: true, type: 'failure', message: 'Contract initialization rejected!' });
      } else {
        setErrorMessage(error.message || error);
      }
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    initializeContract();
  }, []);

  // Auto-connect wallet on page load
  const updateWalletAddress = async () => {
    const accounts = await window?.ethereum?.request({ method: 'eth_accounts' });
    if (accounts.length) {
      setWalletAddress(accounts[0]);
    }
  };
  useEffect(() => {
    connectWallet();
    updateWalletAddress();
    window?.ethereum?.on('accountsChanged', updateWalletAddress);
  }, []);

  useEffect(() => {
    if(step!==-1 && contract){
      createEventListener({navigate,contract,provider,walletAddress,setShowAlert,setUpdateGameData,player1Ref,player2Ref})
    }
  }, [contract,step])


  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);
  useEffect(() => {
    if(errorMessage){
      const parsedErrorMessage=errorMessage?.reason?.slice('execution reverted: '.length).slice(0,-1)
      if(parsedErrorMessage){
        setShowAlert({ status: true, type: 'failure', message: parsedErrorMessage });
      }
    }
  }, [errorMessage])

  const fetchGameData=async () => {
    setLoading(true)
    const fetchedBattles=await contract.getAllBattles();
    const playersBattles=fetchedBattles.filter((battle)=>(battle.players[0]===walletAddress || battle.players[1] === walletAddress))
    setPrevBattles(playersBattles);
    const pendingBattles=fetchedBattles.filter((battle)=>battle.battleStatus===0)
    let activeBattle=null;
    fetchedBattles.forEach((battle) => {

      if(battle.players[0]===walletAddress || battle.players[1] === walletAddress){
        if (battle.winner.startsWith('0x00')) {
          activeBattle=battle;
        }
      }
    });
    const battlesWon = playersBattles.filter((battle) => battle.winner === walletAddress).length;
    setBattleWon(battlesWon)
    if(activeBattle){
      navigate(`battle/${activeBattle?.name}`)
    }
    setGameData({pendingBattles : pendingBattles.slice(1) , activeBattle})
    setLoading(false)
  }
  useEffect(() => {
    if (contract && registered) fetchGameData()
    }, [contract,updateGameData,walletAddress,registered])

  useEffect(() => {
    const fetchTokenData=async () => {
      setLoading(true)
      try {
        const tokensAvailable=await contract.isPlayerToken(walletAddress)
        const player=await contract.getPlayer(walletAddress)
        setPlayer(player)
        if(tokensAvailable){
          const tokens=await contract.getPlayerTokens(walletAddress)
          setTokens(tokens)
        }else{
          setTokens([])
        }
      } catch (error) {
        setErrorMessage(error)
        console.log(error);
      }
      setLoading(false)
    }
  if (contract && walletAddress && registered ) fetchTokenData()

  }, [contract,walletAddress,registered])

  useEffect(() => {
    const resetParams=async () => {

      const currentStep=await GetParams()
      setStep(currentStep.step)
    }
    resetParams()
    window.ethereum.on('chainChanged',()=>resetParams())
    window.ethereum.on('accountsChanged',()=>resetParams())
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        fetchGameData,
        gameData,
        updateGameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
        prevBattles,
        title, setTitle,
        description, setDescription,
        registered, setRegistered,
        loading, setLoading,
        updateWalletAddress,
        battleWon,
        tokens,
        player
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
