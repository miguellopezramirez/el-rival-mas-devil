import React from 'react';
import { ExternalLink } from 'lucide-react';
import PlayerList from '../components/game/PlayerList';
import Jumbotron from '../components/game/Jumbotron';
import MoneyChain from '../components/game/MoneyChain';
import GameControls from '../components/game/GameControls';
import RegistrationScreen from '../components/game/RegistrationScreen';
import RoundSummaryScreen from '../components/game/RoundSummaryScreen';
import GodModeModal from '../components/admin/GodModeModal';
import { useGame } from '../context/GameContext';

const ControlView = () => {
  const {
    gameStatus,
    moneyChain,
    currentLevel,
    bankedMoney,
    timer,
    question,
    roundNumber,
    endRound,
    endGame,
    isQuestionVisible,
    toggleQuestionVisibility
  } = useGame();

  // Format timer
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const openProjector = () => {
    window.open('/proyector', 'ProjectorView', 'width=1920,height=1080');
  };

  if (gameStatus === 'REGISTRATION') {
    return (
      <div className="relative h-screen w-screen overflow-y-auto bg-[#000510]">
        <button
          onClick={openProjector}
          className="absolute top-4 right-4 z-[9999] flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-lg"
        >
          <ExternalLink size={16} /> ABRIR PROYECTOR
        </button>
        <RegistrationScreen />
      </div>
    );
  }

  if (gameStatus === 'SUMMARY') {
    return (
      <div className="flex h-screen w-screen overflow-y-auto relative font-sans animate-in fade-in bg-[#000510]">
        {/* Background Stage Lighting */}
        <div className="absolute inset-0 bg-[#000510] -z-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#002266_0%,#000000_70%)] opacity-80 -z-10"></div>

        <div className="w-full flex justify-center py-10 relative">
          <button
            onClick={openProjector}
            className="absolute top-4 right-4 z-[9999] flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-lg"
          >
            <ExternalLink size={16} /> ABRIR PROYECTOR
          </button>

          <button
            onClick={endGame}
            className="absolute top-4 left-4 z-[9999] flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg font-bold uppercase tracking-wider"
          >
            TERMINAR PARTIDA (Reiniciar)
          </button>

          <RoundSummaryScreen />
        </div>
      </div>
    );
  }

  // DEFAULT: 'PLAYING'
  return (
    <div className="flex h-screen w-screen overflow-y-auto relative font-sans animate-in fade-in">

      {/* Background Stage Lighting */}
      <div className="absolute inset-0 bg-[#000510] -z-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#002266_0%,#000000_70%)] opacity-80 -z-10"></div>

      {/* --- FLOATING UI HEADERS (High Z-Index) --- */}

      {/* Open Projector Button */}
      <div className="absolute top-4 right-4 z-[60]">
        <button
          onClick={openProjector}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded shadow-lg"
        >
          <ExternalLink size={16} /> ABRIR PROYECTOR
        </button>
      </div>

      {/* Timer (Top Left) */}
      <div className="absolute top-6 left-8 z-50">
        <div className={`border-2 ${timer < 10 ? 'border-red-500 bg-red-900/50' : 'border-game-blue bg-black/80'} transition-colors duration-500 rounded-lg px-6 py-2 shadow-[0_0_15px_rgba(0,85,255,0.5)]`}>
          <span className={`text-4xl font-mono font-bold tracking-widest ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {formatTime(timer)}
          </span>
        </div>
      </div>

      {/* Round Indicator (Top Center-Right) */}
      <div className="absolute top-8 right-60 z-50">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_white]">
          ROUND: {roundNumber}
        </h2>
      </div>

      {/* --- MAIN COLUMNS --- */}
      <div className="w-full min-h-full flex pt-20 pb-4">

        {/* Left: Players & Total Pot */}
        <div className="w-80 min-h-full flex flex-col px-6 border-r border-white/10 bg-black/20">
          {/* Total Pot (Moved Up) */}
          <div className="flex flex-col items-center mb-6 pt-4">
            <div className="game-puck w-48 h-12">
              <div className="game-puck-body bg-indigo-900/50"></div>
              <div className="game-puck-top bg-black/80 border-indigo-500 z-20 flex items-center justify-center">
                <span className="text-white font-bold text-lg relative z-30 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  ★ ${bankedMoney.toLocaleString()} ★
                </span>
              </div>
            </div>
            <span className="text-indigo-300 text-xs uppercase tracking-widest mt-2 font-bold">Total Acumulado</span>
          </div>

          {/* PlayerList */}
          <div className="flex-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <PlayerList />
          </div>
        </div>

        {/* Center: Question & Controls */}
        <div className="flex-1 min-h-full flex flex-col items-center relative px-8">

          {/* Question Area */}
          <div className="w-full flex-1 flex items-center justify-center py-4">
            <div className="w-full max-w-3xl">
              <Jumbotron question={question} showAnswer={true} />
            </div>
          </div>

          {/* Controls Area */}
          <div className="w-full flex justify-center pb-8 sticky bottom-0 bg-[#000510]/80 backdrop-blur-sm z-30 py-4">
            <GameControls />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={toggleQuestionVisibility}
              className={`px-4 py-2 rounded font-bold uppercase tracking-widest text-xs shadow ${isQuestionVisible ? 'bg-yellow-600 text-black' : 'bg-gray-700 text-gray-300'}`}
            >
              {isQuestionVisible ? 'Ocultar (Proyector)' : 'Mostrar (Proyector)'}
            </button>
          </div>
        </div>

        {/* Right: Money Chain */}
        <div className="w-64 min-h-full flex items-center justify-center border-l border-white/10 bg-black/20">
          <MoneyChain
            chain={moneyChain}
            currentLevel={currentLevel}
            bankedMoney={bankedMoney}
          />
        </div>

      </div>

      <GodModeModal />
    </div>
  );
};

export default ControlView;
