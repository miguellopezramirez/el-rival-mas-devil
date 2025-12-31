import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trash2, UserPlus, Play } from 'lucide-react';

const RegistrationScreen = () => {
  const { players, registerPlayer, removePlayer, startGame } = useGame();
  const [name, setName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (name.trim()) {
      registerPlayer(name.trim());
      setName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000510] text-white p-8">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-game-blue tracking-widest text-center uppercase drop-shadow-[0_0_15px_rgba(0,85,255,0.8)]">
        Registro de Jugadores
      </h1>

      <div className="w-full max-w-md bg-[#001133] border-2 border-game-blue rounded-xl p-6 shadow-2xl mb-8">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del jugador"
            className="flex-1 bg-black/50 border border-white/20 rounded px-4 py-2 text-white focus:outline-none focus:border-game-cyan transition-colors"
            autoFocus
          />
          <button
            type="submit"
            className="bg-game-blue hover:bg-blue-600 text-white p-2 rounded transition-colors"
          >
            <UserPlus />
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {players.length === 0 && (
            <p className="text-center text-gray-500 italic">No hay jugadores registrados</p>
          )}
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded hover:bg-white/10 transition-colors">
              <span className="font-bold text-lg">{p.name}</span>
              <button
                onClick={() => removePlayer(p.id)}
                className="text-red-400 hover:text-red-200 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={startGame}
          disabled={players.length < 2}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xl uppercase tracking-widest transition-all ${players.length < 2
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(0,255,0,0.6)] hover:scale-105'
            }`}
        >
          <Play fill="currentColor" /> Comenzar Juego
        </button>
      </div>
      {players.length < 2 && (
        <p className="text-gray-500 mt-2 text-sm">Mínimo 2 jugadores para comenzar</p>
      )}
    </div>
  );
};

export default RegistrationScreen;
