import React from 'react';

const Jumbotron = ({ question, showAnswer = true, showQuestion = true }) => {
  return (
    <div className="game-tank flex flex-col items-center justify-center p-12 text-center text-white">
      {/* Decorative sparkles/particles could go here */}

      {/* Content */}
      <div className="z-10 bg-[#001133ab] p-6 rounded-xl border border-white/10 shadow-inner">
        <h2 className="text-game-cyan text-sm uppercase tracking-[0.3em] font-bold mb-4 opacity-70">
          {question.category || "Pregunta Actual"}
        </h2>
        <p className={`text-3xl md:text-5xl font-bold leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${!showQuestion ? 'blur-md opacity-50' : ''}`}>
          {showQuestion ? question.question : "..."}
        </p>
        {showAnswer && (
          <p className="mt-6 text-xl text-yellow-400 font-mono opacity-80">
            R: {question.answer}
          </p>
        )}
      </div>

    </div>
  );
};

export default Jumbotron;
