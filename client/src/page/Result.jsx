import React, { useState, useEffect } from 'react';
import picture2 from '../components/Landing/images/Picture4.png';
import { useParams ,useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { Loader } from '../components';
import styles from '../styles'
const Result = () => {
    const {battleName}=useParams()
    const navigate = useNavigate()
    const [battleData, setBattleData] = useState({
      playerName: "",
      opponentName: "",
      battleName: battleName,
      isVictory: undefined,
      playerClass: "",
      opponentClass: "",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsRunning(true);
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5.2; // 1.67% per second (100% in 60s)
      });
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/create-battle');
      setIsRunning(false);
      setProgress(0);
    }, 20000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

    const {contract,gameData,walletAddress,setErrorMessage}=useGlobalContext()
    useEffect(() => {
      const getPlayerInfo = async () => {
        setLoading(true);
          try {
              if (!contract) return;

              let player01Address = null;
              let player02Address = null;

              const battle = await contract.getBattle(battleName);

              if (battle.players[0] === walletAddress) {
                  player01Address = battle.players[0];
                  player02Address = battle.players[1];
              } else {
                  player01Address = battle.players[1];
                  player02Address = battle.players[0];
              }

              const player1 = await contract.getPlayer(player01Address);
              const player2 = await contract.getPlayer(player02Address);

              const winnerName =
                  battle.winner === walletAddress
                      ? "You"
                      : battle.winner === battle.players[0]
                      ? player1.playerName
                      : player2.playerName;

              // **Update battleData state**
              setBattleData({
                  playerName: player1.playerName,
                  opponentName: player2.playerName,
                  battleName: battleName,
                  isVictory: battle.winner === walletAddress,
                  playerClass: player01Address.slice(0, 5) + "..." + player01Address.slice(-5),
                  opponentClass: player02Address.slice(0, 5) + "..." + player02Address.slice(-5),
              });

          } catch (error) {
              setErrorMessage(error);
              console.error(error);
          }finally {
              setLoading(false);
          }
      };

      if (contract) getPlayerInfo();
  }, [contract, gameData, battleName, walletAddress]);

  // Demo data - replace with your actual data later

  const [animationState, setAnimationState] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Staged animations for dramatic effect
    const stages = [300, 800, 1400, 2000];

    stages.forEach((delay, index) => {
      setTimeout(() => {
        setAnimationState(index + 1);
      }, delay);
    });

    if (battleData.isVictory) {
      setTimeout(() => setShowConfetti(true), 500);
    }

    return () => {
      // Cleanup timers if component unmounts
    };
  }, [battleData.isVictory]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-siteblack py-8">
      {/* Dynamic background */}
      <div className="absolute inset-0 z-0">
        {/* Background image - replace src with your actual image path */}
        <div className="absolute inset-0 bg-bat bg-cover bg-center opacity-30"
             >
        </div>


        {/* Floating particles effect for mystical feel */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-300 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Victory/defeat ambient effects */}
      {battleData.isVictory ? (
        <>
          {/* Victory light rays */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-1/2 h-full  blur-3xl animate-pulse"></div>
            <div className="absolute top-0 left-1/3 w-1/3 h-full bg-green-800 blur-3xl animate-pulse"
                style={{animationDelay: '1.5s'}}></div>
          </div>

          {/* Victory confetti */}
          {showConfetti && (
            <div className="absolute inset-0 z-10">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 opacity-70"
                  style={{
                    top: '-5%',
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#131519'][Math.floor(Math.random() * 5)],
                    animation: `fall ${3 + Math.random() * 5}s linear forwards`,
                    animationDelay: `${Math.random() * 3}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                ></div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Defeat effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 w-full h-1/3 bg-red-900/10 blur-3xl"></div>
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-24 bg-gradient-to-t from-red-800 to-transparent opacity-70"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: 'rotate(180deg)',
                    animation: `ember ${2 + Math.random() * 4}s ease-in infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main content container */}
      <div className={`relative z-10 max-w-4xl w-full transition-all duration-700 transform ${animationState > 0 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="mx-4">
          {/* Battle title banner */}
          <div className="relative mb-6">
            {/* Decorative elements */}
            <div className="absolute -left-4 z-20 -top-4 w-20 h-20 opacity-80">
              {/* You can replace this with an actual dragon image */}
              <img src={picture2} alt="Dragon emblem" className=" object-cover  mix-blend-color-dodge" />
            </div>

            <div className="absolute -right-4 -top-4 z-20 w-20 h-20 opacity-80 transform scale-x-[-1]">
              {/* You can replace this with an actual dragon image */}
              <img src={picture2} alt="Dragon emblem" className="object-cover  mix-blend-color-dodge" />
            </div>

            <div className="text-center bg-gradient-to-r from-transparent via-siteblack to-transparent p-4 backdrop-blur-sm border-t border-b border-siteViolet/50">
              <h1 className="text-4xl md:text-5xl text-siteViolet font-bold font-serif tracking-widest">
                {battleData.battleName}
              </h1>
            </div>
          </div>

          {/* Result announcement */}
          <div className={`transform transition-all duration-1000 delay-300 ${animationState > 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
            <div className={`text-center mb-8 relative ${battleData.isVictory ? 'text-yellow-500' : 'text-red-500'}`}>
              {/* Background glow effect */}
              <div className={`absolute inset-0 blur-md opacity-30 ${battleData.isVictory ? 'bg-green-200' : 'bg-red-200'}`}></div>

              {/* Decorative top ornament */}
              <div className="flex justify-center">
                <svg viewBox="0 0 100 20" width="200" className="text-yellow-600">
                  <path fill="currentColor" d="M0,10 L40,10 L50,0 L60,10 L100,10 L95,15 L90,10 L60,10 L50,20 L40,10 L10,10 L5,15 Z" />
                </svg>
              </div>

              {/* Victory/Defeat text */}
              <h2 className={`font-bold text-3xl md:text-4xl py-6 font-serif tracking-widest ${battleData.isVictory ? 'text-yellow-500' : 'text-red-500'}`}>
                {battleData.isVictory ? 'VICTORY' : 'DEFEAT'}
              </h2>

              {/* Decorative bottom ornament */}
              <div className="flex justify-center transform rotate-180">
                <svg viewBox="0 0 100 20" width="200" className="text-yellow-600">
                  <path fill="currentColor" d="M0,10 L40,10 L50,0 L60,10 L100,10 L95,15 L90,10 L60,10 L50,20 L40,10 L10,10 L5,15 Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Battle details card */}
          <div className={`bg-siteDimBlack/80 backdrop-blur-sm rounded-lg border border-siteViolet/50 overflow-hidden shadow-2xl transition-all duration-1000 transform ${animationState > 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="p-6 md:p-8">
              {/* Champions section */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                {/* Player details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 text-yellow-300 font-medium">You</div>
                  <div className="relative">
                    <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 h-12 w-1 ${battleData.isVictory ? 'bg-green-500' : 'bg-red-500'}  rounded-full hidden md:block`}></div>
                    <div className={`text-2xl font-bold ${battleData.isVictory ? 'text-green-400' : 'text-red-400'}`}>{battleData.playerName}</div>
                    <div className={` ${battleData.isVictory ? 'text-green-200/80' : 'text-red-200/80'} text-sm`}>{battleData.playerClass}</div>
                  </div>
                </div>

                {/* VS symbol */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-yellow-600 flex items-center justify-center">
                    <span className="text-yellow-500 font-bold text-xl">VS</span>
                  </div>
                  <div className="absolute -top-1 -left-1 w-full h-full rounded-full border-2 border-yellow-600 opacity-50 animate-ping"></div>
                </div>

                {/* Opponent details */}
                <div className="flex-1 text-center md:text-right">
                  <div className="mb-2 text-yellow-300 font-medium">Opponent</div>
                  <div className="relative">
                    <div className={`absolute -right-3 top-1/2 transform -translate-y-1/2 h-12 w-1  ${battleData.isVictory ? 'bg-green-500' : 'bg-red-500'} rounded-full hidden md:block`}></div>
                    <div className={`text-2xl font-bold ${battleData.isVictory ? 'text-red-400' : 'text-green-400'}`}>{battleData.opponentName}</div>
                    <div className={`text-sm ${battleData.isVictory ? 'text-red-200/80' : 'text-green-200/80'}`}>{battleData.opponentClass}</div>
                  </div>
                </div>
              </div>


              {/* Rewards section (only shown for victory) */}
              <div className={`mt-8 transition-all duration-1000 delay-500 transform ${animationState > 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center mb-4">
              <h3 className={`text-2xl font-serif font-bold ${battleData.isVictory ? 'text-green-400' : 'text-red-400'}`}>
                {battleData.isVictory ? 'Card Acquired!' : 'Card Lost!'}
              </h3>
              <p className="text-gray-300 mt-1">
                {battleData.isVictory
                  ? "You've claimed the card from your opponent"
                  : "Your opponent has taken the card from your collection"}
              </p>
            </div>
          </div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${animationState > 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-red-100  font-bold text-lg transform transition-all hover:scale-105 border-2 active:scale-95 shadow-lg shadow-red-700/20 hover:shadow-red-600/40" onClick={() => navigate('/create-battle')}  style={{ borderImage: `conic-gradient(white ${progress}%, transparent 0%) 1`,}}>
              Battle Again
            </button>

          </div>
        </div>
      </div>
      {
        loading && (
          <div className={`${styles.gameLoadContainer} flex justify-center items-center`}>
            <Loader/>
          </div>
        )
      }
      {/* Custom CSS for animations */}
      <style>
        {`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }

        @keyframes ember {
          0% { opacity: 0; transform: translateY(0) rotate(180deg); }
          50% { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(-100px) rotate(180deg); }
        }
        `}
      </style>

    </div>
  );
};

export default Result;