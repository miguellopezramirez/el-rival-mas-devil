import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';

const GameControls = () => {
  const {
    handleCorrect,
    handleIncorrect,
    handleBank,
    toggleTimer,
    resetTimer,
    endRound,
    isTimerRunning
  } = useGame();

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Timer Controls */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={toggleTimer}
          className="p-2 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors"
          title={isTimerRunning ? "Pause Timer" : "Start Timer"}
        >
          {isTimerRunning ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-2 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={20} className="text-white" />
        </button>
        <button
          onClick={endRound}
          className="p-2 rounded-full bg-red-900 border border-red-700 hover:bg-red-800 transition-colors"
          title="End Round"
        >
          <Square size={20} className="text-white fill-current" />
        </button>
      </div>

      {/* Main Game Actions */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleIncorrect}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-4 border-red-400 shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-95 transition-transform flex items-center justify-center group"
        >
          <span className="text-white font-bold text-xs uppercase tracking-wider group-hover:drop-shadow-[0_0_5px_white]">Incorrecto</span>
        </button>

        <button
          onClick={handleBank}
          className="w-32 h-32 rounded-full bg-gradient-to-b from-[#333] to-[#000] border-4 border-white/30 shadow-[0_4px_10px_rgba(0,0,0,1)] active:scale-95 transition-transform flex flex-col items-center justify-center z-10"
        >
          <span className="text-game-gold font-bold text-2xl tracking-widest drop-shadow-md">BANCO</span>
        </button>

        <button
          onClick={handleCorrect}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-green-900 border-4 border-green-400 shadow-[0_0_20px_rgba(0,255,0,0.5)] active:scale-95 transition-transform flex items-center justify-center group"
        >
          <span className="text-white font-bold text-xs uppercase tracking-wider group-hover:drop-shadow-[0_0_5px_white]">Correcto</span>
        </button>
      </div>
    </div>
  );
};

export default GameControls;
