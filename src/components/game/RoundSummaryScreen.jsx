import React from 'react';
import { useGame } from '../../context/GameContext';
import { useGameSounds } from '../../hooks/useGameSounds';
import { Trophy, ThumbsDown, ArrowRight, Undo2, PartyPopper } from 'lucide-react';

const RoundSummaryScreen = ({ isProjector = false }) => {
  const { players, bankedMoney, startGame, eliminatePlayer, revivePlayer, questionPacks, selectedPackId, changeQuestionPack } = useGame();
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
    <div className="flex flex-col items-center min-h-screen bg-[#000510] text-white p-4 animate-in fade-in duration-1000 w-full">
      <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] mt-8 text-center">
        Reporte de Ronda
      </h1>
      <h2 className="text-4xl md:text-5xl text-game-gold mb-12 font-mono drop-shadow-md text-center">
        Total Bancado: ${bankedMoney.toLocaleString()}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-2xl mb-12 px-4">

        {/* Strongest */}
        <div className="bg-gradient-to-br from-green-900/40 to-black border border-green-500/50 rounded-xl p-8 flex flex-col items-center shadow-[0_0_40px_rgba(0,255,0,0.15)] backdrop-blur-sm">
          <div className="bg-green-600 p-4 rounded-full mb-6 shadow-[0_0_20px_rgba(0,255,0,0.6)]">
            <Trophy size={50} className="text-white" />
          </div>
          <h3 className="text-green-400 uppercase tracking-widest text-lg font-bold mb-2">El Rival Más Fuerte</h3>
          <p className="text-6xl font-bold text-white mb-6 text-center">{strongest?.name || '-'}</p>
          <div className="flex gap-8 text-xl text-gray-300">
            <span>Aciertos: <strong className="text-white">{strongest?.stats.correct ?? 0}</strong></span>
            <span>Bancado: <strong className="text-white">${strongest?.stats.banked ?? 0}</strong></span>
          </div>
        </div>

        {/* Weakest */}
        <div className="bg-gradient-to-br from-red-900/40 to-black border border-red-500/50 rounded-xl p-8 flex flex-col items-center shadow-[0_0_40px_rgba(255,0,0,0.15)] backdrop-blur-sm">
          <div className="bg-red-600 p-4 rounded-full mb-6 shadow-[0_0_20px_rgba(255,0,0,0.6)]">
            <ThumbsDown size={50} className="text-white" />
          </div>
          <h3 className="text-red-400 uppercase tracking-widest text-lg font-bold mb-2">El Rival Más Débil</h3>
          <p className="text-6xl font-bold text-white mb-6 text-center">{weakest?.name || '-'}</p>
          <div className="flex gap-8 text-xl text-gray-300">
            <span>Errores: <strong className="text-white">{weakest?.stats.incorrect ?? 0}</strong></span>
            <span>Bancado: <strong className="text-white">${weakest?.stats.banked ?? 0}</strong></span>
          </div>
        </div>

      </div>

      {/* Stats Table */}
      <div className="w-full max-w-screen-2xl bg-[#001133ab] rounded-xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/80 text-game-blue uppercase text-lg font-bold tracking-wider">
              <tr>
                <th className="p-6 text-center w-20">#</th>
                <th className="p-6">Jugador</th>
                <th className="p-6 text-center">Aciertos</th>
                <th className="p-6 text-center">Incorrectos</th>
                <th className="p-6 text-center">Racha Max</th>
                <th className="p-6 text-right">Bancado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xl font-medium">
              {sortedByPerformance.map((p, index) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-center font-mono text-gray-500">{index + 1}</td>
                  <td className="p-6 font-bold flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500 shadow-[0_0_10px_lime]' : index === sortedByPerformance.length - 1 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-500'}`}></div>
                    {p.name}
                  </td>
                  <td className="p-6 text-center text-green-400 font-bold">{p.stats.correct}</td>
                  <td className="p-6 text-center text-red-500 font-bold">{p.stats.incorrect}</td>
                  <td className="p-6 text-center text-yellow-400 font-bold">{p.stats.streak}</td>
                  <td className="p-6 text-right font-mono text-white">${p.stats.banked.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isProjector && (
        <div className="flex justify-center w-full max-w-screen-2xl mb-12">
          <button
            onClick={playWin}
            className="flex items-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-full text-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(234,179,8,0.5)] hover:shadow-[0_0_35px_rgba(234,179,8,0.8)] transform hover:scale-105"
          >
            <PartyPopper size={28} /> Festejar Ganador
          </button>
        </div>
      )}

      {!isProjector && (
        <div className="w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Elimination Section */}
          <div className="p-8 bg-red-950/30 border border-red-500/30 rounded-xl">
            <h3 className="text-2xl font-bold text-red-500 uppercase tracking-widest mb-6 border-b border-red-500/30 pb-2">Gestión de Eliminación</h3>
            <p className="text-gray-400 mb-6 text-base">
              Haz clic para eliminar. Los eliminados se ven opacos. Haz clic en la X para cancelar.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                        relative border py-4 rounded-lg transition-all flex items-center justify-center gap-2 group text-lg font-bold
                        ${isEliminated
                        ? 'bg-black/80 border-gray-700 text-gray-600 opacity-50 grayscale hover:opacity-100 hover:border-white'
                        : 'bg-black/50 border-white/20 hover:border-red-500 hover:bg-red-900/50 text-white'
                      }
                        `}
                  >
                    <span className={isEliminated ? 'line-through decoration-red-500 decoration-4' : ''}>
                      {p.name}
                    </span>
                    {isEliminated && (
                      <div className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors" title="Cancelar Eliminación">
                        <Undo2 size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="p-8 bg-blue-950/30 border border-blue-500/30 rounded-xl flex-1">
              <h3 className="text-2xl font-bold text-blue-500 uppercase tracking-widest mb-6 border-b border-blue-500/30 pb-2">Configuración</h3>
              <div className="flex flex-col gap-4">
                <label className="text-gray-300 text-lg uppercase tracking-wider font-bold">Pack de Preguntas</label>
                <select
                  className="bg-black text-white p-4 rounded-lg border border-gray-600 focus:border-blue-500 outline-none text-lg"
                  value={selectedPackId}
                  onChange={(e) => changeQuestionPack(e.target.value)}
                >
                  {questionPacks.map(pack => (
                    <option key={pack.id} value={pack.id}>{pack.name} ({pack.data.length} preguntas)</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={startGame} // Re-using startGame to reset round for now
              className="w-full bg-white text-black px-8 py-6 rounded-xl text-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-4 shadow-xl"
            >
              Siguiente Ronda <ArrowRight size={32} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoundSummaryScreen;
