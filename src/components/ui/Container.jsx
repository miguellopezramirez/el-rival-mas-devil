import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`
      relative p-4 rounded-lg 
      bg-game-dark/80 backdrop-blur-sm
      border border-game-blue/50
      shadow-[0_0_15px_rgba(0,85,255,0.3)]
      ${className}
    `}>
      {/* Decorative corner accents could go here */}
      {children}
    </div>
  );
};

export default Container;
