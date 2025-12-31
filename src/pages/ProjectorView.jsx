import React, { useState } from 'react';
import PlayerList from '../components/game/PlayerList';
import Jumbotron from '../components/game/Jumbotron';
import MoneyChain from '../components/game/MoneyChain';
import { mockPlayers, mockMoneyChain, mockQuestion, mockGameState } from '../data/mock';

const ProjectorView = () => {
  const [players, setPlayers] = useState(mockPlayers);
  const [question, setQuestion] = useState(mockQuestion);
  const [gameState, setGameState] = useState(mockGameState);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative font-sans">

      {/* Background Stage Lighting */}
      <div className="absolute inset-0 bg-[#000510] -z-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#002266_0%,#000000_70%)] opacity-80 -z-10"></div>

      {/* --- FLOATING UI HEADERS (High Z-Index) --- */}

      {/* Timer (Top Left) */}
      <div className="absolute top-6 left-8 z-50">
        <div className="border-2 border-game-blue bg-black/80 rounded-lg px-6 py-2 shadow-[0_0_15px_rgba(0,85,255,0.5)]">
          <span className="text-4xl font-mono font-bold text-white tracking-widest">
            0:{gameState.timer}
          </span>
        </div>
      </div>

      {/* Button ADD TO POT (Top Center) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
        <button className="bg-gradient-to-b from-gray-500 to-gray-700 border-2 border-white/50 text-white font-bold px-8 py-2 rounded uppercase tracking-widest shadow-lg active:scale-95 transition-transform">
          ADD TO POT
        </button>
      </div>

      {/* Round Indicator (Top Right) */}
      <div className="absolute top-8 right-8 z-50">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_white]">
          ROUND: 1
        </h2>
      </div>


      {/* --- MAIN COLUMNS --- */}
      <div className="w-full h-full flex items-center justify-between px-16 pt-20 pb-10 gap-10">

        {/* Left: Players (Bars) */}
        <div className="w-72 h-full flex flex-col justify-center">
          <PlayerList players={players} />
          {/* Total Pot for Players */}
          <div className="mt-4 flex flex-col items-center">
            <div className="game-puck w-40 h-10">
              <div className="game-puck-body bg-black"></div>
              <div className="game-puck-top bg-black border-gray-600 z-20">
                <span className="text-white font-bold text-sm relative z-30">$0 TOTAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Blue Tank (Questions) */}
        <div className="flex-1 h-3/5 flex items-center justify-center relative">
          <Jumbotron question={question} />
        </div>

        {/* Right: Money Chain (Pucks) */}
        <div className="w-64 h-full flex items-center justify-end">
          <MoneyChain
            chain={mockMoneyChain}
            currentLevel={gameState.currentMoneyLevel}
            bankedMoney={gameState.bankedMoney}
          />
        </div>

      </div>

    </div>
  );
};

export default ProjectorView;
