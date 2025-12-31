import React from 'react';

const MoneyChain = ({ chain, currentLevel, bankedMoney }) => {
  return (
    <div className="flex flex-col h-full items-center justify-end w-full max-w-[200px] pb-10">

      {/* Money Stack: Reversed visually to stash upwards */}
      <div className="flex flex-col-reverse w-full gap-[-5px]">
        {chain.map((step) => {
          const isCurrent = step.level === currentLevel;

          let puckClass = "game-puck";
          if (isCurrent) puckClass += " game-puck-gold";

          return (
            <div key={step.level} className={puckClass}>
              {/* The 3D layered structure */}
              <div className="game-puck-body"></div>
              <div className="game-puck-top">
                <span className="font-bold text-white drop-shadow-md text-sm md:text-base relative z-30">
                  ${step.value.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banco / Total Puck */}
      <div className="mt-6 w-full relative h-14 game-puck">
        <div className="absolute top-3 w-full h-full rounded-[50%] bg-[#111] shadow-xl"></div>
        <div className="absolute top-0 w-full h-full rounded-[50%] bg-gradient-to-b from-[#333] to-[#000] border border-white/20 flex flex-col items-center justify-center z-10 shadow-inner">
          <span className="text-white font-bold text-lg relative z-20">${bankedMoney.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 tracking-widest relative z-20">BANCO</span>
        </div>
      </div>

    </div>
  );
};

export default MoneyChain;
