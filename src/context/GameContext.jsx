import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from '../data/questions.json';
import { mockMoneyChain } from '../data/mock';
import { useGameSounds } from '../hooks/useGameSounds';
import { useGameSync } from '../hooks/useGameSync';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {

  // --- Persistence Helper ---
  const loadState = (key, defaultValue) => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`rival_weakest_${key}`);
        if (saved !== null) return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Storage load failed", e);
    }
    return defaultValue;
  };

  // --- Game State (Initialized from Storage) ---
  const [gameStatus, setGameStatus] = useState(() => loadState('gameStatus', 'REGISTRATION'));
  const { playCorrect, playIncorrect, playBank, playTimeout } = useGameSounds();

  // Players & Stats
  const [players, setPlayers] = useState(() => loadState('players', []));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(() => loadState('currentPlayerIndex', 0));

  // Round Configuration
  const [roundNumber, setRoundNumber] = useState(() => loadState('roundNumber', 1));
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => loadState('currentLevelIndex', 0));
  const [bankedMoney, setBankedMoney] = useState(() => loadState('bankedMoney', 0));
  const [timer, setTimer] = useState(() => loadState('timer', 120));
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Don't persist running state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => loadState('currentQuestionIndex', 0));
  const [isQuestionVisible, setIsQuestionVisible] = useState(false); // Default hidden on load/refresh logic? Or persist? Let's NOT persist simplicity or maybe persist.
  // User said "hide on round start". So default false. Persistence might be good if refreshed mid-read.
  // I'll persist it.
  // const [isQuestionVisible, setIsQuestionVisible] = useState(() => loadState('isQuestionVisible', false));

  // Chains
  // {level:0, value:0} is index 0.
  const logicChain = [...mockMoneyChain].sort((a, b) => a.value - b.value);
  const currentPotentialMoney = logicChain[currentLevelIndex]?.value || 0;

  // Join all state into a single object for broadcasting
  const fullState = {
    gameStatus,
    players,
    currentPlayerIndex,
    currentLevelIndex,
    bankedMoney,
    timer,
    isTimerRunning,
    currentQuestionIndex,
    roundNumber,
    isQuestionVisible
  };

  // Determine Role (Simple location check)
  const isProjector = window.location.pathname.includes('proyector');
  const role = isProjector ? 'RECEIVER' : 'SENDER';

  // Handle receiving state (Projector)
  const handleStateReceived = (receivedState) => {
    if (isProjector) {
      setGameStatus(receivedState.gameStatus);
      setPlayers(receivedState.players);
      setCurrentPlayerIndex(receivedState.currentPlayerIndex);
      setCurrentLevelIndex(receivedState.currentLevelIndex);
      setBankedMoney(receivedState.bankedMoney);
      setTimer(receivedState.timer);
      setIsTimerRunning(receivedState.isTimerRunning);
      setCurrentQuestionIndex(receivedState.currentQuestionIndex);
      setRoundNumber(receivedState.roundNumber);
      setIsQuestionVisible(receivedState.isQuestionVisible);
    }
  };

  // Handle request for state (Control)
  const handleRequestState = () => {
    // We strictly use the current references in scope, or better, we just trigger a broadcast effect?
    // Since this callback might close over old state if not careful, we rely on the effect below 
    // OR we explicitly call broadcastState with the variables we have in scope (which are closures).
    // React state closures might be stale here if this function isn't recreated?
    // actually useGameSync hook effect dependency list includes onRequestState. 
    // We need to ensure we send CURRENT state.
    // The easiest way is to set a "forceSync" flag or simply call broadcastState(fullState).
    // Since `fullState` is recreated every render, and `handleRequestState` closes over it...
    // We need to make sure `useGameSync` is updated with the new `handleRequestState`.
    // Yes, `fullState` is defined above.
    broadcastState(fullState);
  };

  const { broadcastState, requestInitialState } = useGameSync(role, handleStateReceived, handleRequestState);

  // Request initial state on mount if Projector
  useEffect(() => {
    if (isProjector) {
      requestInitialState();
    }
  }, [isProjector]);

  // Broadcast on change (Debounced slightly or just effect?)
  // Effect on all state dependencies to broadcast
  // Broadcast on change AND Persist
  useEffect(() => {
    if (!isProjector) {
      broadcastState(fullState);

      // Save to storage
      localStorage.setItem('rival_weakest_gameStatus', JSON.stringify(gameStatus));
      localStorage.setItem('rival_weakest_players', JSON.stringify(players));
      localStorage.setItem('rival_weakest_currentPlayerIndex', JSON.stringify(currentPlayerIndex));
      localStorage.setItem('rival_weakest_roundNumber', JSON.stringify(roundNumber));
      localStorage.setItem('rival_weakest_currentLevelIndex', JSON.stringify(currentLevelIndex));
      localStorage.setItem('rival_weakest_bankedMoney', JSON.stringify(bankedMoney));
      localStorage.setItem('rival_weakest_timer', JSON.stringify(timer));
      localStorage.setItem('rival_weakest_currentQuestionIndex', JSON.stringify(currentQuestionIndex));
      localStorage.setItem('rival_weakest_isQuestionVisible', JSON.stringify(isQuestionVisible));
    }
  }, [
    gameStatus, players, currentPlayerIndex, currentLevelIndex,
    bankedMoney, timer, isTimerRunning, currentQuestionIndex, roundNumber, isQuestionVisible
  ]);

  // --- Effects ---

  // Timer Logic
  useEffect(() => {
    // Only run timer logic on SENDER. Receiver just receives the timer value.
    if (isProjector) return;

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
  }, [isTimerRunning, timer, isProjector]);

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
    setIsQuestionVisible(false); // Hide question at start of round
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
    if (!isTimerRunning) {
      // Starting timer: Reveal question automatically
      setIsQuestionVisible(true);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer(120);
    setIsTimerRunning(false);
  };

  const toggleQuestionVisibility = () => {
    setIsQuestionVisible(prev => !prev);
  };

  const endGame = () => {
    if (window.confirm("¿Seguro de TERMINAR LA PARTIDA? Se borrarán todos los jugadores y el progreso.")) {
      setGameStatus('REGISTRATION');
      setPlayers([]);
      setRoundNumber(1);
      setCurrentLevelIndex(0);
      setBankedMoney(0);
      setTimer(120);
      setIsTimerRunning(false);
      // Clear storage manually if needed or let effect handle it (effect saves state).
      // Since we update state, effect will run and overwrite storage with "REGISTRATION"/empty players.
    }
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
    isQuestionVisible, toggleQuestionVisibility, // Exposed for logic
    handleCorrect,
    handleIncorrect,
    handleBank,
    endRound,
    endGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
