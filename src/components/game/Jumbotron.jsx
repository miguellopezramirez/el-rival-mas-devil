import React from 'react';

const Jumbotron = ({ question, showAnswer = true, showQuestion = true, className = "" }) => {
  return (
    <div className={`game-tank flex flex-col items-center justify-center p-8 text-center text-white ${className}`}>
      {/* Decorative sparkles/particles could go here */}

      {/* Content */}
      <div className="z-10 bg-[#001133ab] p-6 rounded-xl border border-white/10 shadow-inner w-full">
        <h2 className="text-game-cyan text-sm uppercase tracking-[0.3em] font-bold mb-4 opacity-70">
          {question.category || "Pregunta Actual"}
        </h2>
        <p className={`font-bold leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 ${!showQuestion ? 'blur-md opacity-50' : ''} ${className.includes('text-') ? '' : 'text-3xl md:text-5xl'}`}>
          {/* If className has text size, let it inherit/override. Otherwise default. 
               Actually, className is on the wrapper. Tailwind text sizing inherits.
               So if I pass text-6xl to wrapper, the p will inherit if it doesn't have a class?
               No, specific class beats inherited.
               I'll explicitly handle a prop `textSize` or just apply `className` to the `p` tag?
               The user wants the PROJECTOR to be huge.
               I'll use a prop `textSize` defaulting to "text-3xl md:text-5xl".
           */}
          <span className={className.includes('text-') ? '' : 'text-3xl md:text-5xl'}>
            {showQuestion ? question.question : "..."}
          </span>
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
