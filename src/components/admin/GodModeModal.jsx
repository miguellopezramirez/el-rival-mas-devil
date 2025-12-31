import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Settings, X, Plus, Minus, Save } from 'lucide-react';

const GodModeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    bankedMoney, setBankedMoney,
    timer, setTimer,
    currentLevel, setCurrentLevelIndex,
    roundNumber, setRoundNumber
  } = useGame();

  // Local state for edits
  const [localBank, setLocalBank] = useState(bankedMoney);
  const [localTimer, setLocalTimer] = useState(timer);
  const [localRound, setLocalRound] = useState(roundNumber);

  const handleOpen = () => {
    setLocalBank(bankedMoney);
    setLocalTimer(timer);
    setLocalRound(roundNumber);
    setIsOpen(true);
  };

  const applyChanges = () => {
    setBankedMoney(Number(localBank));
    setTimer(Number(localTimer));
    setRoundNumber(Number(localRound));
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700 text-gray-500 rounded-full z-50 transition-colors"
        title="Ajustes Manuales"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#001133] border border-game-blue rounded-xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Settings size={20} /> Ajustes Manuales (God Mode)
        </h2>

        {/* Round Number Adjustment */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Ronda Actual</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localRound}
              onChange={(e) => setLocalRound(e.target.value)}
              className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Bank Adjustment */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Banco Actual</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localBank}
              onChange={(e) => setLocalBank(e.target.value)}
              className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Timer Adjustment */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Tiempo Restante (seg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={localTimer}
              onChange={(e) => setLocalTimer(e.target.value)}
              className="flex-1 bg-black/50 border border-white/20 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Chain Level Adjustment */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Nivel de Cadena (Index)</label>
          <div className="flex items-center gap-4 bg-black/50 p-2 rounded">
            <button
              onClick={() => setCurrentLevelIndex(prev => Math.max(0, prev - 1))}
              className="p-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
            >
              <Minus size={16} />
            </button>
            <span className="text-white font-mono flex-1 text-center">{currentLevel}</span>
            <button
              onClick={() => setCurrentLevelIndex(prev => prev + 1)}
              className="p-1 bg-gray-700 rounded hover:bg-gray-600 text-white"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button
          onClick={applyChanges}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Save size={18} /> Guardar Cambios
        </button>

      </div>
    </div>
  );
};

export default GodModeModal;
