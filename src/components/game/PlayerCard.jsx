import React from 'react';

const PlayerCard = ({ player }) => {
  const isEliminated = player.status === 'eliminated';

  let barClass = "game-bar";
  if (isEliminated) barClass += " game-bar-eliminated";

  return (
    <div className={barClass}>
      {/* Ensure text is above any background layers */}
      <span className="font-bold text-white tracking-widest uppercase text-sm drop-shadow-md relative z-20">
        {player.name}
      </span>
    </div>
  );
};

export default PlayerCard;
