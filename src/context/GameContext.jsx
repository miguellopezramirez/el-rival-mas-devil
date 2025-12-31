import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import { mockMoneyChain } from '../data/mock';
import { useGameSounds } from '../hooks/useGameSounds';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // --- Game State ---
  const [gameStatus, setGameStatus] = useState('REGISTRATION'); // 'REGISTRATION', 'PLAYING', 'SUMMARY'
  const { playCorrect, playIncorrect, playBank, playTimeout } = useGameSounds();

  // Players & Stats
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Round Configuration
  const [roundNumber, setRoundNumber] = useState(1);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [bankedMoney, setBankedMoney] = useState(0);
  const [timer, setTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Chains
  // {level:0, value:0} is index 0.
  const logicChain = [...mockMoneyChain].sort((a, b) => a.value - b.value);
  const currentPotentialMoney = logicChain[currentLevelIndex]?.value || 0;

  // --- Effects ---

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      endRound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  // --- Actions ---

  const registerPlayer = (name) => {
    const newPlayer = {
      id: Date.now(),
      name,
      status: 'active',
      stats: {
        correct: 0,
        incorrect: 0,
        banked: 0,
        streak: 0,
      }
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const eliminatePlayer = (id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, status: 'eliminated' } : p));
  };

  const revivePlayer = (id) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
  };

  const startGame = () => {
    if (players.length > 0) {
      setGameStatus('PLAYING');
      resetRound();
    }
  };

  const getActivePlayers = () => players.filter(p => p.status === 'active');

  const resetRound = () => {
    setCurrentLevelIndex(0);
    setBankedMoney(0);
    setTimer(120 - ((roundNumber - 1) * 10)); // Optional: Decrease time per round? keeping simple 120 for now unless requested.
    // Let's just keep 120 or maybe user wants it manual. 
    // Logic: "start new round" -> increment round number? 
    // Usually startGame is called once. resetRound is called for next round.
    // If gameStatus is PLAYING, we might want to increment.
    // Let's increment ONLY if we are coming from Summary.
    if (gameStatus === 'SUMMARY') {
      setRoundNumber(prev => prev + 1);
    }

    setIsTimerRunning(false);

    // Reset individual round stats
    setPlayers(prev => prev.map(p => ({
      ...p,
      stats: { correct: 0, incorrect: 0, banked: 0, streak: 0 }
    })));

    // Set start player (first active)
    const active = players.filter(p => p.status === 'active');
    // We need to map active player index back to global players index or just track Active Player Logic separately
    // Let's ensure currentPlayerIndex points to an active player.
    // Simplest is to find first active player index in the main array.
    const firstActiveIndex = players.findIndex(p => p.status === 'active');
    setCurrentPlayerIndex(firstActiveIndex !== -1 ? firstActiveIndex : 0);
  };

  const nextTurn = () => {
    // Find next active player
    let nextIndex = (currentPlayerIndex + 1) % players.length;
    let loopCount = 0;
    while (players[nextIndex].status !== 'active' && loopCount < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      loopCount++;
    }
    setCurrentPlayerIndex(nextIndex);
  };

  const updatePlayerStats = (type, value = 0) => {
    setPlayers(prev => prev.map((p, idx) => {
      if (idx !== currentPlayerIndex) return p;

      const newStats = { ...p.stats };
      if (type === 'CORRECT') {
        newStats.correct += 1;
        newStats.streak += 1;
      } else if (type === 'INCORRECT') {
        newStats.incorrect += 1;
        newStats.streak = 0;
      } else if (type === 'BANK') {
        newStats.banked += value;
      }
      return { ...p, stats: newStats };
    }));
  };

  const handleCorrect = () => {
    playCorrect();
    updatePlayerStats('CORRECT');
    if (currentLevelIndex < logicChain.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
    nextQuestion();
    nextTurn();
  };

  const handleIncorrect = () => {
    playIncorrect();
    updatePlayerStats('INCORRECT');
    setCurrentLevelIndex(0); // Reset chain
    nextQuestion();
    nextTurn();
  };

  const handleBank = () => {
    const moneyToBank = currentPotentialMoney;
    if (moneyToBank > 0) {
      playBank();
      setBankedMoney((prev) => prev + moneyToBank);
      updatePlayerStats('BANK', moneyToBank);
      setCurrentLevelIndex(0);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questionsData.length);
  };

  const endRound = () => {
    playTimeout();
    setGameStatus('SUMMARY');
    setIsTimerRunning(false);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(120);
    setIsTimerRunning(false);
  };

  const value = {
    gameStatus,
    players,
    currentPlayer: players[currentPlayerIndex],
    currentPlayerIndex,
    registerPlayer,
    removePlayer,
    eliminatePlayer,
    revivePlayer,
    startGame,

    moneyChain: mockMoneyChain,
    currentLevel: logicChain[currentLevelIndex]?.level || 0,
    currentPotentialMoney,
    bankedMoney, setBankedMoney, // Exposed for God Mode
    roundNumber, setRoundNumber, // Exposed for God Mode

    timer, setTimer, // Exposed for God Mode
    isTimerRunning,
    toggleTimer,
    resetTimer,
    currentLevelIndex, setCurrentLevelIndex, // Exposed for God Mode

    question: questionsData[currentQuestionIndex],
    handleCorrect,
    handleIncorrect,
    handleBank,
    endRound,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
