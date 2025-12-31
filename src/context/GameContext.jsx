import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import { mockMoneyChain } from '../data/mock';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Game Configuration
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0); // 0 = $0 (bottom of loose chain)
  const [bankedMoney, setBankedMoney] = useState(0);
  const [timer, setTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Derived state
  // mockMoneyChain is sorted highest to lowest in mock.js, 
  // but logically level 1 ($1000) is the first step.
  // Let's assume mockMoneyChain is [200k, 100k, ... 1k].
  // So the "bottom" or "start" is the last element.
  // Let's reverse it internally to work from 0 to N easily if needed, 
  // OR just handle the logic carefully.
  // Let's use the mockMoneyChain as is (reversed visual), so we need to access it correctly.
  // The mock data: { level: 1, value: 1000 } is at the END of the array if it's reversed.
  // Let's simplify: sorted chain low to high for logic.
  // With {level:0, value:0} added to chain, it's the first element.
  const logicChain = [...mockMoneyChain].sort((a, b) => a.value - b.value);

  const currentPotentialMoney = logicChain[currentLevelIndex]?.value || 0;

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleCorrect = () => {
    if (currentLevelIndex < logicChain.length) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
    nextQuestion();
  };

  const handleIncorrect = () => {
    setCurrentLevelIndex(0); // Reset chain
    nextQuestion();
  };

  const handleBank = () => {
    setBankedMoney((prev) => prev + currentPotentialMoney);
    setCurrentLevelIndex(0);
    // Usually banking doesn't skip a question, but depends on rules. 
    // We'll keep the question for now.
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questionsData.length);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(120);
    setIsTimerRunning(false);
  };

  const value = {
    moneyChain: mockMoneyChain, // Pass the visual one
    currentLevel: logicChain[currentLevelIndex]?.level || 0, // Visual level indicator
    currentPotentialMoney,
    bankedMoney,
    timer,
    isTimerRunning,
    question: questionsData[currentQuestionIndex],
    handleCorrect,
    handleIncorrect,
    handleBank,
    toggleTimer,
    resetTimer
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
