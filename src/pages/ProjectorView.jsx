import React, { useState } from 'react';
import PlayerList from '../components/game/PlayerList';
import Jumbotron from '../components/game/Jumbotron';
import MoneyChain from '../components/game/MoneyChain';
import GameControls from '../components/game/GameControls';
import { useGame } from '../context/GameContext';
import { mockPlayers } from '../data/mock';

const ProjectorView = () => {
  const [players, setPlayers] = useState(mockPlayers);
  const { moneyChain, currentLevel, bankedMoney, timer, question, handleBank } = useGame();

  // Format timer MM:SS (or just seconds if specific preference)
  // Request said "0:45", so let's format nice
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Button ADD TO POT (Top Center) Visual Indicator mainly - actual action now in Controls */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-50">
        {/* Kept for visual reference if needed, but 'BANCO' button handles this now visually in bottom center? 
             Actually prompt said "Botón 'BANCO': El dinero acumulado... Implementa los botones de control en la parte inferior central."
             So we can remove this top one or keep it as a status indicator. Let's remove to not confuse. 
         */}
      </div>

      {/* Round Indicator (Top Right) */}
      <div className="absolute top-8 right-8 z-50">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_white]">
          ROUND: 1
        </h2>
      </div>


      {/* --- MAIN COLUMNS --- */}
      <div className="w-full h-full flex flex-col items-center pt-20 pb-4">

        {/* Upper Area: Game Elements */}
        <div className="flex items-center justify-between w-full px-16 flex-1 gap-10">
          {/* Left: Players (Bars) */}
          <div className="w-72 h-full flex flex-col justify-center">
            <PlayerList players={players} />
            {/* Total Pot for Players */}
            {/* Not explicitly wired yet, using static $0 for round pot display or could be bankedMoney? 
                 Req: "dinero acumulado... se suma al 'POZO TOTAL' de la ronda". 
                 Let's show a global pot or round pot. 'bankedMoney' is "Round Bank". 
             */}
            <div className="mt-4 flex flex-col items-center">
              <div className="game-puck w-40 h-10">
                <div className="game-puck-body bg-black"></div>
                <div className="game-puck-top bg-black border-gray-600 z-20">
                  <span className="text-white font-bold text-sm relative z-30">${bankedMoney.toLocaleString()} TOTAL</span>
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
              chain={moneyChain}
              currentLevel={currentLevel}
              bankedMoney={bankedMoney}
            />
          </div>
        </div>

        {/* Lower Area: Controls */}
        <div className="w-full flex justify-center pb-4 z-50">
          <GameControls />
        </div>

      </div>

    </div>
  );
};

export default ProjectorView;
