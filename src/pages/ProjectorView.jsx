import React from 'react';
import PlayerList from '../components/game/PlayerList';
import Jumbotron from '../components/game/Jumbotron';
import MoneyChain from '../components/game/MoneyChain';
import RoundSummaryScreen from '../components/game/RoundSummaryScreen';
import { useGame } from '../context/GameContext';

const ProjectorView = () => {
  const {
    gameStatus,
    moneyChain,
    currentLevel,
    bankedMoney,
    timer,
    question,
    roundNumber,
    players, currentPlayer, isQuestionVisible
  } = useGame();

  // Helper variable to check if game has started (active round)
  const isGameStarted = gameStatus === 'PLAYING';

  // Format timer
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (gameStatus === 'REGISTRATION') {
    return (
      <div className="min-h-screen bg-[#000510] flex items-center justify-center text-white p-8">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-blue-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,85,255,0.5)]">
            El Rival Más Débil
          </h1>
          <h2 className="text-2xl text-gray-400 mb-8 animate-pulse">Esperando Jugadores...</h2>
          <div className="grid grid-cols-2 gap-4">
            {players.map(p => (
              <div key={p.id} className="bg-gray-800 p-4 rounded text-xl border border-gray-600">
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'SUMMARY') {
    return (
      <div className="pointer-events-none [&_button]:hidden">
        <RoundSummaryScreen isProjector={true} />
      </div>
    );
  }

  // DEFAULT: 'PLAYING'
  return (
    <div className="flex h-screen w-screen overflow-hidden relative font-sans animate-in fade-in cursor-none">

      {/* Background Stage Lighting */}
      <div className="absolute inset-0 bg-[#000510] -z-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#002266_0%,#000000_70%)] opacity-80 -z-10"></div>

      {/* --- FLOATING UI HEADERS (High Z-Index) --- */}

      {/* Timer (Top Left) */}
      <div className="absolute top-6 left-8 z-50">
        <div className={`border-2 ${timer < 10 ? 'border-red-500 bg-red-900/50' : 'border-game-blue bg-black/80'} transition-colors duration-500 rounded-lg px-6 py-2 shadow-[0_0_15px_rgba(0,85,255,0.5)]`}>
          <span className={`text-4xl font-mono font-bold tracking-widest ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Round Indicator (Top Right) */}
      <div className="absolute top-8 right-8 z-50">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_white]">
          ROUND: {roundNumber}
        </h2>
      </div>

      {/* --- MAIN COLUMNS --- */}
      <div className="w-full h-full flex flex-col items-center pt-20 pb-4">

        {/* Upper Area: Game Elements */}
        <div className="flex items-center justify-between w-full px-16 flex-1 gap-10">
          {/* Left: Players (Bars) */}
          <div className="w-72 h-full flex flex-col items-center overflow-hidden">
            {/* Total Pot for Round (Moved to Top for visibility) */}
            <div className="mb-8 flex flex-col items-center flex-shrink-0 pt-10">
              <div className="game-puck w-40 h-10">
                <div className="game-puck-body bg-black"></div>
                <div className="game-puck-top bg-black border-gray-600 z-20">
                  <span className="text-white font-bold text-sm relative z-30">${bankedMoney.toLocaleString()} TOTAL</span>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 overflow-y-auto scroll-smooth no-scrollbar flex justify-center">
              <PlayerList />
            </div>
          </div>

          {/* Center: Blue Tank (Questions) */}
          <div className="flex-1 h-3/5 flex items-center justify-center relative">
            <Jumbotron question={question} showAnswer={false} showQuestion={isQuestionVisible} />
            {/* Note: I need to access isQuestionVisible from context. ProjectorView already uses useGame() */}
          </div>

          {/* Right: Money Chain (Pucks) */}
          <div className="w-64 h-full flex items-center justify-center">
            <MoneyChain
              chain={moneyChain}
              currentLevel={currentLevel}
              bankedMoney={bankedMoney}
            />
          </div>
        </div>

        {/* NO CONTROLS HERE */}

      </div>
    </div>
  );
};

export default ProjectorView;
