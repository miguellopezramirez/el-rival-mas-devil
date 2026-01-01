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
    isTimerRunning,
    nextQuestion
  } = useGame();

  return (
    <div className="flex flex-row items-center gap-8">

      {/* Timer Controls */}
      <div className="flex flex-col gap-2 bg-slate-900/50 p-3 rounded-xl border border-white/10">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center mb-1">Tiempo</span>
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="p-3 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors"
            title={isTimerRunning ? "Pause Timer" : "Start Timer"}
          >
            {isTimerRunning ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-slate-800 border border-slate-600 hover:bg-slate-700 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw size={18} className="text-white" />
          </button>
          <button
            onClick={endRound}
            className="p-3 rounded-full bg-red-900 border border-red-700 hover:bg-red-800 transition-colors"
            title="End Round"
          >
            <Square size={18} className="text-white fill-current" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Skip Question Button */}
        <button
          onClick={nextQuestion}
          className="w-12 h-12 rounded-full bg-slate-700 border border-slate-500 shadow-md active:scale-95 transition-transform flex items-center justify-center group mr-2"
          title="Pasar Pregunta (Sin Afectar)"
        >
          <span className="text-gray-300 font-bold text-[8px] uppercase tracking-wider text-center group-hover:text-white">Pasar</span>
        </button>

        <button
          onClick={handleIncorrect}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-400 shadow-[0_0_15px_rgba(255,0,0,0.5)] active:scale-95 transition-transform flex items-center justify-center group"
        >
          <span className="text-white font-bold text-[10px] uppercase tracking-wider group-hover:drop-shadow-[0_0_2px_white]">Incorrecto</span>
        </button>

        <button
          onClick={handleBank}
          className="w-24 h-24 rounded-full bg-gradient-to-b from-[#333] to-[#000] border-4 border-white/30 shadow-[0_4px_10px_rgba(0,0,0,1)] active:scale-95 transition-transform flex flex-col items-center justify-center z-10"
        >
          <span className="text-game-gold font-bold text-lg tracking-widest drop-shadow-md">BANCO</span>
        </button>

        <button
          onClick={handleCorrect}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-green-900 border-2 border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.5)] active:scale-95 transition-transform flex items-center justify-center group"
        >
          <span className="text-white font-bold text-[10px] uppercase tracking-wider group-hover:drop-shadow-[0_0_2px_white]">Correcto</span>
        </button>
      </div>
    </div>
  );
};

export default GameControls;
