import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Settings, X, Plus, Minus, Save } from 'lucide-react';

const GodModeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    bankedMoney, setBankedMoney,
    totalGameMoney, setTotalGameMoney,
    timer, setTimer,
    currentLevel, setCurrentLevelIndex,
    roundNumber, setRoundNumber
  } = useGame();

  // Local state for edits
  const [localBank, setLocalBank] = useState(bankedMoney);
  const [localTotal, setLocalTotal] = useState(totalGameMoney);
  const [localTimer, setLocalTimer] = useState(timer);
  const [localRound, setLocalRound] = useState(roundNumber);

  const handleOpen = () => {
    setLocalBank(bankedMoney);
    setLocalTotal(totalGameMoney);
    setLocalTimer(timer);
    setLocalRound(roundNumber);
    setIsOpen(true);
  };

  const applyChanges = () => {
    setBankedMoney(Number(localBank));
    setTotalGameMoney(Number(localTotal));
    setTimer(Number(localTimer));
    setRoundNumber(Number(localRound));
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700 text-white rounded-full z-50 transition-colors border border-white/20"
        title="Ajustes Manuales"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-[#001133] border border-game-blue rounded-xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Settings size={20} /> Ajustes Manuales (God Mode)
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">

          {/* Round Number Adjustment */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Ronda Actual</label>
            <input
              type="number"
              value={localRound}
              onChange={(e) => setLocalRound(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-game-blue outline-none"
            />
          </div>

          {/* Bank Adjustment */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Banco de la Ronda (Pila)</label>
            <input
              type="number"
              value={localBank}
              onChange={(e) => setLocalBank(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-game-blue outline-none"
            />
          </div>

          {/* Total Adjustment */}
          <div>
            <label className="block text-game-gold text-xs uppercase tracking-wider font-bold mb-1">Total Acumulado (Global)</label>
            <input
              type="number"
              value={localTotal}
              onChange={(e) => setLocalTotal(e.target.value)}
              className="w-full bg-black/50 border border-game-gold/50 rounded px-3 py-2 text-yellow-400 font-bold focus:border-game-gold outline-none"
            />
          </div>

          {/* Timer Adjustment */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Tiempo Restante (seg)</label>
            <input
              type="number"
              value={localTimer}
              onChange={(e) => setLocalTimer(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:border-game-blue outline-none"
            />
          </div>

          {/* Chain Level Adjustment */}
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider font-bold mb-1">Nivel de Cadena (Index)</label>
            <div className="flex items-center gap-4 bg-black/50 p-2 rounded border border-white/10">
              <button
                onClick={() => setCurrentLevelIndex(prev => Math.max(0, prev - 1))}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
              >
                <Minus size={16} />
              </button>
              <span className="text-white font-mono flex-1 text-center font-bold">{currentLevel}</span>
              <button
                onClick={() => setCurrentLevelIndex(prev => prev + 1)}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600 text-white"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

        </div>

        <button
          onClick={applyChanges}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-6 shadow-lg shadow-green-900/20"
        >
          <Save size={18} /> Guardar Cambios
        </button>


      </div>
    </div>
  );
};

export default GodModeModal;
