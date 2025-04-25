import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useGlobalContext } from "../context";
import { CustomButton, PageHOC, CardNew } from "../components";
import {allCards} from '../assets'
import styles from '../styles'

const JoinBattle = () => {
  const { contract, gameData, setShowAlert, setBattleName, walletAddress, setErrorMessage, fetchGameData, tokens } = useGlobalContext();
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedTokenHash, setSelectedTokenHash] = useState(null);
  const [showModal, setShowModal] = useState(false);

  let formattedTokens = tokens.map((token) => ({
    ...token,
    attackStrength: ethers.BigNumber.from(token.attackStrength).toNumber(),
    defenseStrength: ethers.BigNumber.from(token.defenseStrength).toNumber(),
    id: ethers.BigNumber.from(token.id).toNumber(),
    tokenHash: ethers.BigNumber.from(token.tokenHash).toNumber(),
  }));

  useEffect(() => {
    if(tokens.length === 1) {
      setSelectedToken(0);
    }
  }, [tokens]);

  const handleClick = async (battleName) => {
    setBattleName(battleName);

    if(selectedToken === null) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'Select a card to join the battle'
      });
      return;
    }
    try {
      await contract.joinBattle(battleName, tokens[selectedToken].id, { gasLimit: 200000 });
      setShowAlert({ status: true, type: 'success', message: `Joining ${battleName}` });
    } catch (error) {
      setErrorMessage(error);
    }
  }

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>
      <div className="flex flex-col mb-5">
        {
          tokens.length !== 1 &&
          (
        <p className="font-rajdhani font-light text-sm text-white">
          {selectedToken === null ? 'Card not selected' : `Selected card: ${allCards[selectedTokenHash].split('/').pop().split('.')[0] || 'Card'}`}
        </p>
          )
        }
        <div className='w-full flex justify-left gap-8'>
          <CustomButton
            title="Select Card"
            handleClick={() => setShowModal(true)}
            restStyles={`mt-2 ${formattedTokens.length <= 1 && 'hidden'}`}
          />
        </div>
      </div>

      <div className={styles.joinContainer}>
        {gameData.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>{index + 1}. {battle.name}</p>
                <CustomButton
                  title="Join"
                  handleClick={() => handleClick(battle.name)}
                  restStyles={`${formattedTokens.length < 1 && 'cursor-not-allowed'}`}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>Reload to see new battles</p>
        )}
        <CustomButton
          title="Reload"
          handleClick={() => fetchGameData()}
        />
      </div>

      {
        formattedTokens.length < 1
          ? <p className="font-rajdhani font-medium text-lg text-white">No cards available, <span className='text-[#9e1e22] cursor-pointer' onClick={() => navigate('/tokens')}>Create New Card</span></p>
          : <p className={styles.infoText} onClick={() => navigate('/create-battle')}>Or create a new battle.</p>
      }

      {showModal && (
        <div className="fixed z-50  inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-5 rounded-lg text-white w-3/6">
            <h2 className="text-lg font-bold mb-3">Select a Token</h2>
            <div className="flex flex-row max-h-screen overflow-auto gap-2">
              {formattedTokens.map((token, index) => (
                <div key={index}>
                  <button
                    onClick={() => {
                      setSelectedToken(index);
                      setSelectedTokenHash(token.tokenHash);
                      setShowModal(false);
                    }}
                    className="p-2 rounded-md"
                  >
                    <CardNew card={token} />
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
}

export default PageHOC(
  JoinBattle,
  <>Join<br />A Battle</>,
  <>Join already existing battles</>
)