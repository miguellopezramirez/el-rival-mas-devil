import React, { createContext, useContext, useState, useEffect } from 'react';
import { questionPacks } from '../data';
// Fallback or Initial Data
const defaultQuestions = questionPacks[0].data;
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
  const [totalGameMoney, setTotalGameMoney] = useState(() => loadState('totalGameMoney', 0));
  const [timer, setTimer] = useState(() => loadState('timer', 120));
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Don't persist running state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => loadState('currentQuestionIndex', 0));
  // User said "hide on round start". So default false. Persistence might be good if refreshed mid-read.
  // I'll persist it.
  const [isQuestionVisible, setIsQuestionVisible] = useState(() => loadState('isQuestionVisible', false));

  // Question Packs
  const [selectedPackId, setSelectedPackId] = useState(() => loadState('selectedPackId', 'default'));
  const questionsData = questionPacks.find(p => p.id === selectedPackId)?.data || defaultQuestions;

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
    isQuestionVisible,
    selectedPackId,
    totalGameMoney
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
      setSelectedPackId(receivedState.selectedPackId);
      setTotalGameMoney(receivedState.totalGameMoney);
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
      localStorage.setItem('rival_weakest_selectedPackId', JSON.stringify(selectedPackId));
      localStorage.setItem('rival_weakest_totalGameMoney', JSON.stringify(totalGameMoney));
    }
  }, [
    gameStatus, players, currentPlayerIndex, currentLevelIndex,
    bankedMoney, timer, isTimerRunning, currentQuestionIndex, roundNumber, isQuestionVisible, selectedPackId, totalGameMoney
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
    // 1. Determine Start Player Index (Before resetting stats)
    let nextPlayerIndex = 0;

    // Check if we are advancing to a new round (GameStatus is SUMMARY) or starting fresh
    if (gameStatus === 'SUMMARY') {
      // Round 2+: Best Survivor starts. 
      // Filter ONLY Active Players first
      const activeSurvivors = players.filter(p => p.status === 'active');

      // Sort by Best Performance: Correct Answers (Desc) > Banked Money (Desc)
      activeSurvivors.sort((a, b) => {
        if (b.stats.correct !== a.stats.correct) return b.stats.correct - a.stats.correct;
        return b.stats.banked - a.stats.banked;
      });

      // The first player in the sorted list is the Strongest Survivor
      const bestSurvivor = activeSurvivors[0];

      if (bestSurvivor) {
        nextPlayerIndex = players.findIndex(p => p.id === bestSurvivor.id);
      }
      // If bestSurvivor is undefined (everyone eliminated?), default to 0 prevents crash.
    } else {
      // Round 1 (or Game Start): Always start with Player Index 0
      nextPlayerIndex = 0;
    }

    // 2. Perform Round Resets
    setCurrentLevelIndex(0);
    // Preserving logic: 120 - ((roundNumber - 1) * 10)
    setTimer(120 - ((roundNumber - 1) * 10));

    if (gameStatus === 'SUMMARY') {
      setRoundNumber(prev => prev + 1);
    }

    setIsTimerRunning(false);

    // 3. Reset Stats for all players
    setPlayers(prev => prev.map(p => ({
      ...p,
      stats: { correct: 0, incorrect: 0, banked: 0, streak: 0 }
    })));

    // 4. Update Game Totals
    setTotalGameMoney(prev => prev + bankedMoney);
    setBankedMoney(0);

    // 5. Apply the calculated Start Player
    setCurrentPlayerIndex(nextPlayerIndex);
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

  const changeQuestionPack = (packId) => {
    setSelectedPackId(packId);
    setCurrentQuestionIndex(0); // Reset index when pack changes to avoid out of bounds
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
    totalGameMoney, setTotalGameMoney, // GRAND TOTAL Exposed for God Mode
    roundNumber, setRoundNumber, // Exposed for God Mode

    timer, setTimer, // Exposed for God Mode
    isTimerRunning,
    toggleTimer,
    resetTimer,
    currentLevelIndex, setCurrentLevelIndex, // Exposed for God Mode

    question: questionsData[currentQuestionIndex] || { question: "No Question", answer: "-", category: "-" }, // Safety check
    isQuestionVisible, toggleQuestionVisibility, // Exposed for logic
    questionPacks, selectedPackId, changeQuestionPack, // Pack selection
    handleCorrect,
    handleIncorrect,
    handleBank,
    endRound,
    endGame,
    nextQuestion, // Exposed for skipping without side effects
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
