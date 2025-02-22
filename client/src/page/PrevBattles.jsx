import React, { useEffect, useState } from 'react';
import { CustomButton, Loader, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import styles from '../styles';

const PrevBattles = () => {
  const { contract, walletAddress, prevBattles,loading, setLoading } = useGlobalContext();
  const [prevBattlesList, setPrevBattlesList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const formatBattles = async () => {
      setLoading(true);
      try {
        if (prevBattles && prevBattles.length > 0) {
          const formatted = await Promise.all(
            prevBattles.map(async (battle) => {
              const player1 = await contract.getPlayer(battle.players[0]);
              const player2 = await contract.getPlayer(battle.players[1]);
              const winnerName =
                battle.winner === walletAddress
                  ? 'You'
                  : battle.winner === battle.players[0]
                  ? player1.playerName
                  : player2.playerName;

              return {
                battleName: battle.name,
                opponentName: battle.players[0] === walletAddress ? player2 : player1,
                players: [player1, player2],
                winner: winnerName,
              };
            })
          );
          setPrevBattlesList(formatted);
        } else {
          setPrevBattlesList([]);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    };

    formatBattles();
  }, [prevBattles, walletAddress, contract]);

  return (
    // <div className=" max-h-64 lg:max-h-96 w-full overflow-y-auto overflow-x-hidden flex gap-4 flex-col">
    <div className='flex-1'>
      {prevBattlesList.length === 0 ? (
        <div>
          <h3 className="font-rajdhani font-bold text-2xl sm:text-3xl text-white w-full">
            No battles to display. Create a Battle to begin your adventure!
          </h3>
          <CustomButton
            title="Create Battle"
            handleClick={() => navigate('/create-battle')}
            restStyles="mt-6"
          />
        </div>
      ) : (
        prevBattlesList.map((battle, index) => {
          return (
            <div
              key={index}
              className={`w-full h-auto flex flex-col lg:flex-row justify-between items-center border-b-2  border-slate-500`}
            >
              <h3 className="font-rajdhani font-bold text-2xl sm:text-3xl text-white w-full lg:w-1/3">
                <span className="text-[#9e1e22] w-8  inline-block text-center">{index + 1}.</span> {battle.battleName}
              </h3>
              <div className="w-full lg:w-1/3 ml-20 lg:ml-0">
                <p className="font-rajdhani text-lg text-white text-left">
                  {battle.players[0].playerName}
                  <span className="font-bold text-[#9e1e22]"> Vs </span>
                  {battle.players[1].playerName}
                </p>
              </div>
              <p className="w-full lg:w-1/3 font-rajdhani text-lg text-white text-left ml-20 lg:ml-0">
                <span className="font-bold text-[#9e1e22]">Winner:</span> {battle.winner}
              </p>
            </div>
          );
        })
      )}

    </div>
  );
};

export default PageHOC(
  PrevBattles,
  <>Battle History</>,
  <>Recap of Previous Encounters</>
);
