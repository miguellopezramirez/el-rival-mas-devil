import React from 'react';
import { useGame } from '../../context/GameContext';
import { useGameSounds } from '../../hooks/useGameSounds';
import { Trophy, ThumbsDown, ArrowRight, Undo2, PartyPopper } from 'lucide-react';

const RoundSummaryScreen = () => {
  const { players, bankedMoney, startGame, eliminatePlayer, revivePlayer } = useGame();
  const { playWin } = useGameSounds();

  // Filter ONLY active players for the report (Strongest/Weakest/Table) as requested
  const activePlayers = players.filter(p => p.status === 'active');

  const sortedByPerformance = [...activePlayers].sort((a, b) => {
    // Primary: Correct answers (Descending)
    if (b.stats.correct !== a.stats.correct) return b.stats.correct - a.stats.correct;
    // Secondary: Banked money (Descending)
    return b.stats.banked - a.stats.banked;
  });

  const strongest = sortedByPerformance[0];
  const weakest = sortedByPerformance[sortedByPerformance.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000510] text-white p-8 animate-in fade-in duration-1000">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white tracking-widest uppercase">
        Reporte de Ronda
      </h1>
      <h2 className="text-2xl text-game-gold mb-12 font-mono">
        Total Bancado: ${bankedMoney.toLocaleString()}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">

        {/* Strongest */}
        <div className="bg-gradient-to-br from-green-900/50 to-black border border-green-500/50 rounded-xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(0,255,0,0.2)]">
          <div className="bg-green-600 p-3 rounded-full mb-4 shadow-[0_0_15px_rgba(0,255,0,0.6)]">
            <Trophy size={40} className="text-white" />
          </div>
          <h3 className="text-green-400 uppercase tracking-widest text-sm font-bold mb-2">El Rival Más Fuerte</h3>
          <p className="text-4xl font-bold text-white mb-4">{strongest?.name || '-'}</p>
          <div className="flex gap-4 text-sm text-gray-300">
            <span>Aciertos: {strongest?.stats.correct ?? 0}</span>
            <span>Bancado: ${strongest?.stats.banked ?? 0}</span>
          </div>
        </div>

        {/* Weakest */}
        <div className="bg-gradient-to-br from-red-900/50 to-black border border-red-500/50 rounded-xl p-6 flex flex-col items-center shadow-[0_0_30px_rgba(255,0,0,0.2)]">
          <div className="bg-red-600 p-3 rounded-full mb-4 shadow-[0_0_15px_rgba(255,0,0,0.6)]">
            <ThumbsDown size={40} className="text-white" />
          </div>
          <h3 className="text-red-400 uppercase tracking-widest text-sm font-bold mb-2">El Rival Más Débil</h3>
          <p className="text-4xl font-bold text-white mb-4">{weakest?.name || '-'}</p>
          <div className="flex gap-4 text-sm text-gray-300">
            <span>Errores: {weakest?.stats.incorrect ?? 0}</span>
            <span>Bancado: ${weakest?.stats.banked ?? 0}</span>
          </div>
        </div>

      </div>

      {/* Stats Table */}
      <div className="w-full max-w-4xl bg-[#001133] rounded-lg overflow-hidden border border-white/10 mb-8">
        <table className="w-full text-left">
          <thead className="bg-black/50 text-game-blue uppercase text-sm font-bold tracking-wider">
            <tr>
              <th className="p-4">Jugador</th>
              <th className="p-4 text-center">Aciertos</th>
              <th className="p-4 text-center">Incorrectos</th>
              <th className="p-4 text-center">Racha Max</th>
              <th className="p-4 text-right">Bancado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {activePlayers.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold">{p.name}</td>
                <td className="p-4 text-center text-green-400">{p.stats.correct}</td>
                <td className="p-4 text-center text-red-400">{p.stats.incorrect}</td>
                <td className="p-4 text-center text-yellow-400">{p.stats.streak}</td>
                <td className="p-4 text-right font-mono">${p.stats.banked.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center w-full max-w-4xl mb-8">
        <button
          onClick={playWin}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)]"
        >
          <PartyPopper size={20} /> Festejar Ganador
        </button>
      </div>

      {/* Elimination Section */}
      <div className="w-full max-w-4xl mb-8 p-6 bg-red-900/10 border border-red-500/30 rounded-lg">
        <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-4">Gestión de Eliminación</h3>
        <p className="text-gray-400 mb-4 text-sm">
          Haz clic para eliminar. Los eliminados se ven opacos. Haz clic en la X para cancelar.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {players.map(p => {
            const isEliminated = p.status === 'eliminated';
            return (
              <button
                key={p.id}
                onClick={() => {
                  if (isEliminated) {
                    revivePlayer(p.id);
                  } else {
                    if (window.confirm(`¿Estás seguro de eliminar a ${p.name}?`)) {
                      eliminatePlayer(p.id);
                    }
                  }
                }}
                className={`
                   relative border py-3 rounded transition-all flex items-center justify-center gap-2 group
                   ${isEliminated
                    ? 'bg-black/80 border-gray-700 text-gray-600 opacity-50 grayscale hover:opacity-100 hover:border-white'
                    : 'bg-black/50 border-white/20 hover:border-red-500 hover:bg-red-900/50 text-white'
                  }
                 `}
              >
                <span className={isEliminated ? 'line-through decoration-red-500 decoration-2' : ''}>
                  {p.name}
                </span>
                {isEliminated && (
                  <div className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors" title="Cancelar Eliminación">
                    <Undo2 size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={startGame} // Re-using startGame to reset round for now
        className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
      >
        Siguiente Ronda <ArrowRight size={20} />
      </button>

    </div>
  );
};

export default RoundSummaryScreen;
