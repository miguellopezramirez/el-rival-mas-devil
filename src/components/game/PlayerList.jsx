import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerList = ({ players }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[220px] h-full justify-center relative z-10">

      {/* Title */}
      <h3 className="text-center text-game-blue font-bold tracking-widest mb-4 drop-shadow-md opacity-0">...</h3>

      {/* 
         In the reference, the players are stacked. 
         We just list them vertically as pills. 
      */}
      {players.map((player, index) => (
        <div
          key={player.id}
          className="w-full transition-all duration-500 ease-in-out"
        >
          <PlayerCard player={player} />
        </div>
      ))}

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
