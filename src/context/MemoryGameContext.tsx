import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Colours } from '../interfaces/colours';

export interface Block {
  pos: number;
  colourPos: number;
  question: boolean;
  wrong: boolean;
}

interface MemoryGameContextProps {
  // Game State
  round: number;
  blocks: number;
  showTime: number;
  timePenalty: number;
  isMemorising: boolean;
  isCorrect: boolean;
  statusMessage: string;
  memInterval: number;
  memoryGrid: Block[] | null;
  draggedColourPos: number | null;
  setDraggedColourPos: (val: number | null) => void;

  // Settings
  startGrid: number;
  setStartGrid: (val: number) => void;
  increaseGrid: number;
  setIncreaseGrid: (val: number) => void;
  colourSelect: number;
  setColourSelect: (val: number) => void;
  roundTime: number;
  setRoundTime: (val: number) => void;
  penaltyTime: number;
  setPenaltyTime: (val: number) => void;

  // Actions
  startGame: () => void;
  restart: () => void;
  nextRound: () => void;
  startRound: () => void;
  updateMemoryGrid: (pos: number, colourPos: number, question: boolean) => void;
}

const MemoryGameContext = createContext<MemoryGameContextProps | undefined>(undefined);

// Local storage helpers
const getSetting = (key: string, defaultValue: number): number => {
  if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
  try {
    const val = localStorage.getItem(`memory_setting_${key}`);
    return val !== null ? Number(val) : defaultValue;
  } catch (e) {
    console.error('Error reading setting from localStorage', e);
    return defaultValue;
  }
};

const saveSetting = (key: string, value: number) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(`memory_setting_${key}`, String(value));
  } catch (e) {
    console.error('Error saving setting to localStorage', e);
  }
};

export const MemoryGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings State
  const [startGrid, setStartGridState] = useState(() => getSetting('startGrid', 3));
  const [increaseGrid, setIncreaseGridState] = useState(() => getSetting('increaseGrid', 1));
  const [colourSelect, setColourSelectState] = useState(() => getSetting('colourSelect', 6));
  const [roundTime, setRoundTimeState] = useState(() => getSetting('roundTime', 1));
  const [penaltyTime, setPenaltyTimeState] = useState(() => getSetting('penaltyTime', 1));

  // Settings wrappers to auto-save to localStorage
  const setStartGrid = (val: number) => { setStartGridState(val); saveSetting('startGrid', val); };
  const setIncreaseGrid = (val: number) => { setIncreaseGridState(val); saveSetting('increaseGrid', val); };
  const setColourSelect = (val: number) => { setColourSelectState(val); saveSetting('colourSelect', val); };
  const setRoundTime = (val: number) => { setRoundTimeState(val); saveSetting('roundTime', val); };
  const setPenaltyTime = (val: number) => { setPenaltyTimeState(val); saveSetting('penaltyTime', val); };

  // 2. Game State
  const [round, setRound] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [showTime, setShowTime] = useState(0);
  const [timePenalty, setTimePenalty] = useState(0);
  const [isMemorising, setIsMemorising] = useState(true);
  const [isCorrect, setIsCorrect] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Press Start');
  const [memInterval, setMemInterval] = useState(0);

  // Hidden lists mirroring Angular's arrays
  const [memoryRetain, setMemoryRetain] = useState<Block[]>([]);
  const [memoryGrid, setMemoryGrid] = useState<Block[] | null>(null);
  const [memoryWhite, setMemoryWhite] = useState<Block[]>([]);
  const [memoryWrong, setMemoryWrong] = useState<Block[]>([]);

  // Drag interaction state
  const [draggedColourPos, setDraggedColourPos] = useState<number | null>(null);

  // Interval reference
  const intervalRef = useRef<any>(null);

  // References to keep callbacks and interval logic updated with freshest states
  const stateRef = useRef({
    round,
    blocks,
    showTime,
    timePenalty,
    isMemorising,
    isCorrect,
    statusMessage,
    memInterval,
    memoryGrid,
    memoryRetain,
    memoryWhite,
    memoryWrong,
    startGrid,
    increaseGrid,
    colourSelect,
    roundTime,
    penaltyTime
  });

  useEffect(() => {
    stateRef.current = {
      round,
      blocks,
      showTime,
      timePenalty,
      isMemorising,
      isCorrect,
      statusMessage,
      memInterval,
      memoryGrid,
      memoryRetain,
      memoryWhite,
      memoryWrong,
      startGrid,
      increaseGrid,
      colourSelect,
      roundTime,
      penaltyTime
    };
  }, [
    round, blocks, showTime, timePenalty, isMemorising, isCorrect, statusMessage,
    memInterval, memoryGrid, memoryRetain, memoryWhite, memoryWrong,
    startGrid, increaseGrid, colourSelect, roundTime, penaltyTime
  ]);

  // Load Saved Game Progress on Mount
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const saved = localStorage.getItem('memory_game_progress');
      if (saved) {
        const progress = JSON.parse(saved);
        if (progress && progress.round !== undefined) {
          setRound(progress.round);
          setBlocks(progress.blocks);
          setTimePenalty(progress.timePenalty);
          setMemoryRetain(progress.memoryRetain || []);
          setMemoryWhite(progress.memoryWhite || []);
          setMemoryWrong(progress.memoryWrong || []);
          setIsMemorising(progress.isMemorising);
          setIsCorrect(progress.isCorrect);
          setStatusMessage(progress.statusMessage);
          setMemInterval(progress.memInterval);
          setShowTime(progress.showTime || 0);

          if (progress.round > 0) {
            if (progress.isMemorising) {
              setMemoryGrid(progress.isCorrect ? progress.memoryRetain : progress.memoryWrong);
              // Resume timer
              resumeTimer(progress.showTime || 0, progress.memInterval, progress.isMemorising);
            } else {
              setMemoryGrid(progress.memoryGrid || progress.memoryWhite);
            }
          } else {
            setStatusMessage('Press Start');
          }
        }
      }
    } catch (e) {
      console.error('Error loading progress from localStorage', e);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Sync Progress to LocalStorage
  const saveProgress = (updates: Partial<typeof stateRef.current> = {}) => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const current = { ...stateRef.current, ...updates };
    try {
      const progress = {
        round: current.round,
        blocks: current.blocks,
        timePenalty: current.timePenalty,
        memoryGrid: current.memoryGrid,
        memoryRetain: current.memoryRetain,
        memoryWhite: current.memoryWhite,
        memoryWrong: current.memoryWrong,
        isMemorising: current.isMemorising,
        isCorrect: current.isCorrect,
        statusMessage: current.statusMessage,
        memInterval: current.memInterval,
        showTime: current.showTime
      };
      localStorage.setItem('memory_game_progress', JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress to localStorage', e);
    }
  };

  const resumeTimer = (initialShowTime: number, currentMemInterval: number, currentIsMemorising: boolean) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let localShowTime = initialShowTime;
    intervalRef.current = setInterval(() => {
      localShowTime += 1;
      setShowTime(localShowTime);
      saveProgress({ showTime: localShowTime });

      if (localShowTime >= currentMemInterval || !currentIsMemorising) {
        rememberStatus();
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  const rememberStatus = () => {
    console.log("Cleared");
    setShowTime(0);
    setIsMemorising(false);
    setStatusMessage('Build Blocks');
    setMemoryGrid(stateRef.current.memoryWhite);
    saveProgress({
      showTime: 0,
      isMemorising: false,
      statusMessage: 'Build Blocks',
      memoryGrid: stateRef.current.memoryWhite
    });
  };

  const setMemoryBlock = (retainList: Block[], whiteList: Block[], maxColours: number) => {
    const p = retainList.length;
    const gridCell: Block = {
      pos: p,
      colourPos: Math.floor(Math.random() * maxColours),
      question: false,
      wrong: false
    };
    retainList.push(gridCell);

    const whiteCell: Block = {
      pos: p,
      colourPos: 3, // Default white block pos in original colours is 3
      question: true,
      wrong: false
    };
    whiteList.push(whiteCell);
  };

  const checkBlockColours = (grid: Block[], retain: Block[], wrongList: Block[]) => {
    let check = 0;
    for (let i = 0; i < grid.length; i++) {
      const A = grid[i].colourPos;
      const B = retain[i].colourPos;

      if (A !== B || grid[i].question) {
        if (wrongList[i]) wrongList[i].wrong = true;
        check++;
      } else {
        if (wrongList[i]) wrongList[i].wrong = false;
      }
    }
    return check;
  };

  const logColourArray = (retainList: Block[]) => {
    const colouring = retainList.map(cell => Colours[cell.colourPos]);
    console.log(colouring);
  };

  // --- ACTIONS ---

  const startGame = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const initialRound = 1;
    const initialBlocks = startGrid;
    const initialTimePenalty = 0;

    const retainList: Block[] = [];
    const whiteList: Block[] = [];

    for (let i = 0; i < startGrid; i++) {
      setMemoryBlock(retainList, whiteList, colourSelect);
    }

    const wrongList = retainList.map(item => ({ ...item }));

    setRound(initialRound);
    setBlocks(initialBlocks);
    setTimePenalty(initialTimePenalty);
    setIsMemorising(true);
    setMemoryRetain(retainList);
    setMemoryWhite(whiteList);
    setMemoryWrong(wrongList);
    setIsCorrect(true);

    const nextMemInterval = startGrid * roundTime;
    setMemInterval(nextMemInterval);
    setShowTime(0);

    // Initial grid state is the retained full sequence
    setMemoryGrid(retainList);
    setStatusMessage('First Round');

    saveProgress({
      round: initialRound,
      blocks: initialBlocks,
      timePenalty: initialTimePenalty,
      isMemorising: true,
      memoryRetain: retainList,
      memoryWhite: whiteList,
      memoryWrong: wrongList,
      isCorrect: true,
      memInterval: nextMemInterval,
      showTime: 0,
      memoryGrid: retainList,
      statusMessage: 'First Round'
    });

    // Start show timer
    resumeTimer(0, nextMemInterval, true);
  };

  const restart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setShowTime(0);
    setRound(0);
    setBlocks(0);
    setIsCorrect(true);
    setStatusMessage('Press Start');
    setMemoryGrid(null);
    setMemoryRetain([]);
    setMemoryWhite([]);
    setMemoryWrong([]);

    saveProgress({
      showTime: 0,
      round: 0,
      blocks: 0,
      isCorrect: true,
      statusMessage: 'Press Start',
      memoryGrid: null,
      memoryRetain: [],
      memoryWhite: [],
      memoryWrong: []
    });
  };

  const startShowTimer = (
    nextRoundVal: number,
    nextBlocksVal: number,
    correctState: boolean,
    wrongList: Block[],
    retainList: Block[],
    whiteList: Block[],
    penaltyVal: number
  ) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    console.log("Start next round");
    logColourArray(retainList);

    const gridCopy = whiteList.map(item => ({ ...item }));
    setMemoryGrid(gridCopy);
    setIsMemorising(true);

    let nextStatus = '';
    let finalGridToShow: Block[] = [];

    if (correctState) {
      finalGridToShow = retainList;
      nextStatus = nextRoundVal === 1 ? 'First Round' : 'Correct';
    } else {
      finalGridToShow = wrongList;
      nextStatus = 'Incorrect';
    }

    setMemoryGrid(finalGridToShow);
    setStatusMessage(nextStatus);

    const nextMemInterval = (startGrid + nextRoundVal - 1) * roundTime - penaltyVal;
    setMemInterval(nextMemInterval);
    setShowTime(0);

    saveProgress({
      round: nextRoundVal,
      blocks: nextBlocksVal,
      isCorrect: correctState,
      memoryWrong: wrongList,
      memoryRetain: retainList,
      memoryWhite: whiteList,
      timePenalty: penaltyVal,
      memoryGrid: finalGridToShow,
      isMemorising: true,
      statusMessage: nextStatus,
      memInterval: nextMemInterval,
      showTime: 0
    });

    resumeTimer(0, nextMemInterval, true);
  };

  const nextRound = () => {
    if (stateRef.current.isMemorising) return;

    const currentWrong = stateRef.current.memoryWrong.map(item => ({ ...item, wrong: false }));
    const errorCount = checkBlockColours(
      stateRef.current.memoryGrid || [],
      stateRef.current.memoryRetain,
      currentWrong
    );

    if (errorCount === 0) {
      setIsCorrect(true);
      const nextRoundVal = round + 1;
      const nextBlocksVal = blocks + increaseGrid;

      // Deep copy lists and append new block
      const retainCopy = stateRef.current.memoryRetain.map(item => ({ ...item }));
      const whiteCopy = stateRef.current.memoryWhite.map(item => ({ ...item }));

      for (let m = 0; m < increaseGrid; m++) {
        setMemoryBlock(retainCopy, whiteCopy, colourSelect);
      }

      const wrongCopy = retainCopy.map(item => ({ ...item }));

      setRound(nextRoundVal);
      setBlocks(nextBlocksVal);
      setMemoryRetain(retainCopy);
      setMemoryWhite(whiteCopy);
      setMemoryWrong(wrongCopy);

      startShowTimer(
        nextRoundVal,
        nextBlocksVal,
        true,
        wrongCopy,
        retainCopy,
        whiteCopy,
        timePenalty
      );
    } else {
      setIsCorrect(false);
      const nextPenalty = timePenalty + penaltyTime;
      setTimePenalty(nextPenalty);

      startShowTimer(
        round,
        blocks,
        false,
        currentWrong,
        stateRef.current.memoryRetain,
        stateRef.current.memoryWhite,
        nextPenalty
      );
    }
  };

  const startRound = () => {
    setIsMemorising(false);
    rememberStatus();
  };

  const updateMemoryGrid = (pos: number, colourPos: number, question: boolean) => {
    if (!stateRef.current.memoryGrid) return;

    const gridCopy = stateRef.current.memoryGrid.map(item => ({ ...item }));
    if (gridCopy[pos]) {
      gridCopy[pos] = {
        pos,
        colourPos,
        question,
        wrong: false
      };
    }
    setMemoryGrid(gridCopy);
    saveProgress({ memoryGrid: gridCopy });
  };

  return (
    <MemoryGameContext.Provider value={{
      round,
      blocks,
      showTime,
      timePenalty,
      isMemorising,
      isCorrect,
      statusMessage,
      memInterval,
      memoryGrid,
      draggedColourPos,
      setDraggedColourPos,

      startGrid,
      setStartGrid,
      increaseGrid,
      setIncreaseGrid,
      colourSelect,
      setColourSelect,
      roundTime,
      setRoundTime,
      penaltyTime,
      setPenaltyTime,

      startGame,
      restart,
      nextRound,
      startRound,
      updateMemoryGrid
    }}>
      {children}
    </MemoryGameContext.Provider>
  );
};

export const useMemoryGame = (): MemoryGameContextProps => {
  const context = useContext(MemoryGameContext);
  if (context === undefined) {
    throw new Error('useMemoryGame must be used within a MemoryGameProvider');
  }
  return context;
};
