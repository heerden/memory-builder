import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryGame } from './MemoryGame';
import { MemoryGameProvider } from '../../context/MemoryGameContext';

describe('MemoryGame Component Info Box Visibility & Game Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const infoTextRegex = /Remember the sequence of colored blocks and rebuild it once they get a red outline/i;

  it('should render the information notification by default', () => {
    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    // Verify information text is shown
    const infoElement = screen.queryByText(infoTextRegex);
    expect(infoElement).not.toBeNull();
  });

  it('should hide the information notification and persist state to localStorage when close button is clicked', async () => {
    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    expect(screen.queryByText(infoTextRegex)).not.toBeNull();

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).not.toBeNull();

    // Click close button
    fireEvent.click(closeButton);

    // Verify it is removed from the DOM
    expect(screen.queryByText(infoTextRegex)).toBeNull();

    // Verify it is persisted in localStorage as a JSON map
    const contentStr = localStorage.getItem('memory_builder_content');
    expect(contentStr).not.toBeNull();
    const content = JSON.parse(contentStr!);
    expect(content).toEqual({ hide_info: true });
  });

  it('should not render the information notification if localStorage has hide_info set to true within the memory_builder_content map', () => {
    localStorage.setItem('memory_builder_content', JSON.stringify({ hide_info: true }));

    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    expect(screen.queryByText(infoTextRegex)).toBeNull();
  });

  it('should catch error if localStorage parsing throws in MemoryGame', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
    localStorage.setItem('memory_builder_content', 'invalid-json-string{');

    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should catch error when closing info and localStorage throws in MemoryGame', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is full');
    });

    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should transition through game flow states (start, start round, next round, restart) when buttons are clicked', async () => {
    vi.useFakeTimers();

    render(
      <MemoryGameProvider>
        <MemoryGame />
      </MemoryGameProvider>
    );

    // Initial state: Start button and settings are visible
    const startButton = screen.getByRole('button', { name: /start/i });
    expect(startButton).not.toBeNull();
    expect(screen.getByText(/Number of blocks to start with/i)).not.toBeNull();

    // Click Start
    act(() => {
      fireEvent.click(startButton);
    });
    await act(async () => { });

    // Game started: round is 1, isMemorising is true. Start Round button is visible.
    const startRoundButton = screen.getByRole('button', { name: /start round/i });
    expect(startRoundButton).not.toBeNull();
    expect(screen.getByText(/Memorise Time \(s\)/i)).not.toBeNull();

    // Click Start Round
    act(() => {
      fireEvent.click(startRoundButton);
    });
    await act(async () => { });

    // Building state: isMemorising is false. Next Round button is visible.
    const nextRoundButton = screen.getByRole('button', { name: /next round/i });
    expect(nextRoundButton).not.toBeNull();

    // Click Restart
    const restartButton = screen.getByRole('button', { name: /restart/i });
    act(() => {
      fireEvent.click(restartButton);
    });
    await act(async () => { });

    // Back to initial screen
    expect(screen.queryByRole('button', { name: /start round/i })).toBeNull();
    expect(screen.getByRole('button', { name: /start/i })).not.toBeNull();
  });
});
