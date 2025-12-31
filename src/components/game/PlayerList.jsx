import { useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const PlayerList = () => {
  const { players, currentPlayer } = useGame();
  const activePlayerRef = useRef(null);

  useEffect(() => {
    if (activePlayerRef.current) {
      activePlayerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPlayer]);

  return (
    <div className="flex flex-col items-center w-full max-w-[220px] relative z-10 space-y-2">

      {/* 
         In the reference, the players are stacked. 
         We just list them vertically as pills. 
      */}
      {players.filter(p => p.status === 'active').map((player) => {
        const isTurn = currentPlayer?.id === player.id;
        return (
          <div
            key={player.id}
            ref={isTurn ? activePlayerRef : null}
            className={`w-full transition-all duration-300 ease-in-out ${isTurn ? 'scale-110 z-20' : 'scale-100 opacity-80'}`}
          >
            <div className={`
              relative w-full h-12 mb-2 flex items-center px-4 overflow-hidden rounded-r-full border-l-4 
              ${isTurn
                ? 'bg-gradient-to-r from-game-blue to-black border-white shadow-[0_0_15px_rgba(0,85,255,0.8)]'
                : 'bg-black border-gray-700'
              }
            `}>
              <span className={`font-bold uppercase tracking-widest ${isTurn ? 'text-white' : 'text-gray-400'}`}>
                {player.name}
              </span>

              {/* Optional: Show individual bank or stats here if desired? */}
            </div>
          </div>
        );
      })}

      <div className="mt-8 flex flex-col items-center">
        <div className="game-pill w-full h-12 border-game-blue/50 opacity-0" style={{ background: 'black' }}>
          {/* Spacer to match right column balance if needed */}
        </div>
        <div className="text-sm font-bold tracking-widest text-white mt-1 opacity-0">TOTAL</div>
      </div>

    </div>
  );
};

export default PlayerList;
