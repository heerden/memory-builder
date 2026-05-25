import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryGameProvider, useMemoryGame } from './MemoryGameContext';

// Helper wrapper to render hook with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryGameProvider>{children}</MemoryGameProvider>
);

describe('MemoryGameContext State Machine', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with default settings and states', () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    // Check default settings
    expect(result.current.startGrid).toBe(3);
    expect(result.current.increaseGrid).toBe(1);
    expect(result.current.colourSelect).toBe(6);
    expect(result.current.roundTime).toBe(1);
    expect(result.current.penaltyTime).toBe(1);

    // Check default game state
    expect(result.current.round).toBe(0);
    expect(result.current.blocks).toBe(0);
    expect(result.current.isMemorising).toBe(true);
    expect(result.current.isCorrect).toBe(true);
    expect(result.current.statusMessage).toBe('Press Start');
    expect(result.current.memoryGrid).toBeNull();
  });

  it('should allow updating settings and persist to localStorage', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.setStartGrid(5);
      result.current.setIncreaseGrid(2);
      result.current.setColourSelect(8);
      result.current.setRoundTime(3);
      result.current.setPenaltyTime(2);
    });
    await act(async () => {});

    expect(result.current.startGrid).toBe(5);
    expect(result.current.increaseGrid).toBe(2);
    expect(result.current.colourSelect).toBe(8);
    expect(result.current.roundTime).toBe(3);
    expect(result.current.penaltyTime).toBe(2);

    expect(localStorage.getItem('memory_setting_startGrid')).toBe('5');
    expect(localStorage.getItem('memory_setting_increaseGrid')).toBe('2');
    expect(localStorage.getItem('memory_setting_colourSelect')).toBe('8');
    expect(localStorage.getItem('memory_setting_roundTime')).toBe('3');
    expect(localStorage.getItem('memory_setting_penaltyTime')).toBe('2');
  });

  it('should start the game and initialize round 1', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    expect(result.current.round).toBe(1);
    expect(result.current.blocks).toBe(3); // default startGrid
    expect(result.current.isMemorising).toBe(true);
    expect(result.current.isCorrect).toBe(true);
    expect(result.current.statusMessage).toBe('First Round');

    expect(result.current.memoryGrid).not.toBeNull();
    expect(result.current.memoryGrid?.length).toBe(3);

    // Each block should have a valid colour pos
    result.current.memoryGrid?.forEach((block, index) => {
      expect(block.pos).toBe(index);
      expect(block.colourPos).toBeLessThan(result.current.colourSelect);
      expect(block.question).toBe(false);
      expect(block.wrong).toBe(false);
    });
  });

  it('should increment showTime every second and auto-transition to building mode when timer ends', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    expect(result.current.showTime).toBe(0);
    expect(result.current.memInterval).toBe(3); // startGrid (3) * roundTime (1)

    // Advance timers by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {});
    expect(result.current.showTime).toBe(1);

    // Advance timers by 2 more seconds to trigger auto transition (total 3s)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    await act(async () => {});

    expect(result.current.isMemorising).toBe(false);
    expect(result.current.statusMessage).toBe('Build Blocks');
    expect(result.current.showTime).toBe(0);

    // Grid cells should turn into question blocks
    expect(result.current.memoryGrid).not.toBeNull();
    result.current.memoryGrid?.forEach(block => {
      expect(block.question).toBe(true);
      expect(block.colourPos).toBe(3); // default white block in recall phase
    });
  });

  it('should immediately stop timer and turn into recall blocks when startRound is called', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    // Advance slightly
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {});
    expect(result.current.showTime).toBe(1);
    expect(result.current.isMemorising).toBe(true);

    act(() => {
      result.current.startRound();
    });
    await act(async () => {});

    expect(result.current.isMemorising).toBe(false);
    expect(result.current.showTime).toBe(0);
    expect(result.current.statusMessage).toBe('Build Blocks');
    expect(result.current.memoryGrid?.[0].question).toBe(true);
  });

  it('should update block color in active grid when updateMemoryGrid is called', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    act(() => {
      result.current.startRound();
    });
    await act(async () => {});

    // Verify first block is white (colourPos 3) and a question
    expect(result.current.memoryGrid?.[0].colourPos).toBe(3);
    expect(result.current.memoryGrid?.[0].question).toBe(true);

    act(() => {
      result.current.updateMemoryGrid(0, 1, false); // place GREEN color at pos 0
    });
    await act(async () => {});

    expect(result.current.memoryGrid?.[0].colourPos).toBe(1);
    expect(result.current.memoryGrid?.[0].question).toBe(false);
  });

  it('should transition to next round when nextRound is called with correct block layout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    // Capture the correct answers (retained list)
    const correctSequence = result.current.memoryGrid?.map(b => b.colourPos) || [];

    act(() => {
      result.current.startRound();
    });
    await act(async () => {});

    // Reconstruct the correct sequence manually, flushing each one individually
    for (let index = 0; index < correctSequence.length; index++) {
      const colourPos = correctSequence[index];
      act(() => {
        result.current.updateMemoryGrid(index, colourPos, false);
      });
      await act(async () => {});
    }

    // Call next round
    act(() => {
      result.current.nextRound();
    });
    await act(async () => {});

    expect(result.current.isCorrect).toBe(true);
    expect(result.current.round).toBe(2);
    expect(result.current.blocks).toBe(4); // incremented by increaseGrid (1)
    expect(result.current.statusMessage).toBe('Correct');
    expect(result.current.isMemorising).toBe(true);
    expect(result.current.memoryGrid?.length).toBe(4);
  });

  it('should remain on current round, apply time penalty and outline wrong blocks if incorrect', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    // Capture correct answers, find one that is wrong
    const correctSequence = result.current.memoryGrid?.map(b => b.colourPos) || [];

    act(() => {
      result.current.startRound();
    });
    await act(async () => {});

    // Intentionally construct an incorrect sequence (fill with wrong colors)
    for (let index = 0; index < correctSequence.length; index++) {
      const colourPos = correctSequence[index];
      const wrongColour = (colourPos + 1) % result.current.colourSelect;
      act(() => {
        result.current.updateMemoryGrid(index, wrongColour, false);
      });
      await act(async () => {});
    }

    act(() => {
      result.current.nextRound();
    });
    await act(async () => {});

    expect(result.current.isCorrect).toBe(false);
    expect(result.current.round).toBe(1); // stays on round 1
    expect(result.current.timePenalty).toBe(1); // penaltyTime added
    expect(result.current.statusMessage).toBe('Incorrect');
    expect(result.current.isMemorising).toBe(true);

    // Verify that the wrong cells are flagged
    result.current.memoryGrid?.forEach(block => {
      expect(block.wrong).toBe(true);
    });
  });

  it('should reset all states when restart is called', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    expect(result.current.round).toBe(1);

    act(() => {
      result.current.restart();
    });
    await act(async () => {});

    expect(result.current.round).toBe(0);
    expect(result.current.blocks).toBe(0);
    expect(result.current.statusMessage).toBe('Press Start');
    expect(result.current.memoryGrid).toBeNull();
  });

  it('should throw an error if useMemoryGame is used outside MemoryGameProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useMemoryGame())).toThrowError(
      'useMemoryGame must be used within a MemoryGameProvider'
    );
    
    consoleError.mockRestore();
  });

  it('should load saved game progress from localStorage on mount and resume timer if memorising', async () => {
    vi.useFakeTimers();
    
    const mockProgress = {
      round: 3,
      blocks: 5,
      timePenalty: 2,
      memoryGrid: [
        { pos: 0, colourPos: 1, question: false, wrong: false }
      ],
      memoryRetain: [
        { pos: 0, colourPos: 1, question: false, wrong: false }
      ],
      memoryWhite: [
        { pos: 0, colourPos: 3, question: true, wrong: false }
      ],
      memoryWrong: [
        { pos: 0, colourPos: 1, question: false, wrong: true }
      ],
      isMemorising: true,
      isCorrect: true,
      statusMessage: 'Correct',
      memInterval: 5,
      showTime: 2
    };

    localStorage.setItem('memory_game_progress', JSON.stringify(mockProgress));

    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.round).toBe(3);
    expect(result.current.blocks).toBe(5);
    expect(result.current.timePenalty).toBe(2);
    expect(result.current.isMemorising).toBe(true);
    expect(result.current.statusMessage).toBe('Correct');
    expect(result.current.showTime).toBe(2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {});

    expect(result.current.showTime).toBe(3);
  });

  it('should load progress when isMemorising is false', () => {
    const mockProgress = {
      round: 2,
      blocks: 4,
      timePenalty: 1,
      memoryGrid: [{ pos: 0, colourPos: 3, question: true, wrong: false }],
      memoryRetain: [{ pos: 0, colourPos: 1, question: false, wrong: false }],
      memoryWhite: [{ pos: 0, colourPos: 3, question: true, wrong: false }],
      memoryWrong: [{ pos: 0, colourPos: 1, question: false, wrong: true }],
      isMemorising: false,
      isCorrect: true,
      statusMessage: 'Build Blocks',
      memInterval: 4,
      showTime: 0
    };

    localStorage.setItem('memory_game_progress', JSON.stringify(mockProgress));
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.round).toBe(2);
    expect(result.current.isMemorising).toBe(false);
    expect(result.current.memoryGrid?.[0].question).toBe(true);
  });

  it('should set status to Press Start when round is 0', () => {
    const mockProgress = {
      round: 0,
      statusMessage: 'Build Blocks'
    };

    localStorage.setItem('memory_game_progress', JSON.stringify(mockProgress));
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.round).toBe(0);
    expect(result.current.statusMessage).toBe('Press Start');
  });

  it('should load memoryWrong grid when isCorrect is false during memorisation', () => {
    const mockProgress = {
      round: 1,
      blocks: 3,
      timePenalty: 1,
      memoryRetain: [{ pos: 0, colourPos: 1, question: false, wrong: false }],
      memoryWrong: [{ pos: 0, colourPos: 1, question: false, wrong: true }],
      isMemorising: true,
      isCorrect: false,
      statusMessage: 'Incorrect',
      memInterval: 3,
      showTime: 0
    };

    localStorage.setItem('memory_game_progress', JSON.stringify(mockProgress));
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.isCorrect).toBe(false);
    expect(result.current.memoryGrid?.[0].wrong).toBe(true);
  });

  it('should handle corrupted JSON string in memory_game_progress gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('memory_game_progress', 'invalid-json-string{');

    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.round).toBe(0);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should handle saveProgress localStorage exception gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    act(() => {
      result.current.startGame();
    });

    expect(result.current.round).toBe(1);
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should ignore nextRound call if isMemorising is true', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    expect(result.current.isMemorising).toBe(true);
    expect(result.current.round).toBe(1);

    act(() => {
      result.current.nextRound();
    });
    await act(async () => {});

    // Round should still be 1 (ignored nextRound because we are memorising)
    expect(result.current.round).toBe(1);
  });

  it('should do nothing inside updateMemoryGrid if memoryGrid is null', () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    expect(result.current.memoryGrid).toBeNull();

    act(() => {
      result.current.updateMemoryGrid(0, 1, false);
    });

    expect(result.current.memoryGrid).toBeNull();
  });

  it('should ignore updateMemoryGrid call if cell index is out of bounds', async () => {
    const { result } = renderHook(() => useMemoryGame(), { wrapper });

    act(() => {
      result.current.startGame();
    });
    await act(async () => {});

    expect(result.current.memoryGrid).not.toBeNull();
    const originalGrid = result.current.memoryGrid;

    act(() => {
      result.current.updateMemoryGrid(999, 1, false);
    });
    await act(async () => {});

    // Grid remains same
    expect(result.current.memoryGrid).toEqual(originalGrid);
  });

  it('should handle localStorage reading errors gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Localstorage is blocked');
    });

    const { result } = renderHook(() => useMemoryGame(), { wrapper });
    
    expect(result.current.startGrid).toBe(3);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it('should handle localStorage writing errors gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Localstorage is full');
    });

    const { result } = renderHook(() => useMemoryGame(), { wrapper });
    
    act(() => {
      result.current.setStartGrid(6);
    });

    expect(result.current.startGrid).toBe(6);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
