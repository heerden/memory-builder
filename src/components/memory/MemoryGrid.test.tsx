import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryGrid } from './MemoryGrid';
import { useMemoryGame } from '../../hooks/useMemoryGame';

// Mock the hook to return custom context values
vi.mock('../../hooks/useMemoryGame', () => ({
  useMemoryGame: vi.fn()
}));

describe('MemoryGrid Component', () => {
  it('should return null (render nothing) if memoryGrid is null', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      memoryGrid: null
    } as any);

    const { container } = render(<MemoryGrid />);
    expect(container.firstChild).toBeNull();
  });

  it('should render a list of MemoryBlocks when memoryGrid is populated', () => {
    const mockGrid = [
      { pos: 0, colourPos: 1, question: false, wrong: false },
      { pos: 1, colourPos: 2, question: true, wrong: false }
    ];

    vi.mocked(useMemoryGame).mockReturnValue({
      memoryGrid: mockGrid,
      isMemorising: false,
      draggedColourPos: null
    } as any);

    const { container } = render(<MemoryGrid />);

    const gridDiv = container.querySelector('.memory-grid');
    expect(gridDiv).not.toBeNull();

    const blockDivs = container.querySelectorAll('.memory-block');
    expect(blockDivs.length).toBe(2);
  });

  it('should fallback to index for key if pos is undefined', () => {
    const mockGrid = [
      { colourPos: 1, question: false, wrong: false }
    ] as any; // pos is undefined

    vi.mocked(useMemoryGame).mockReturnValue({
      memoryGrid: mockGrid,
      isMemorising: false,
      draggedColourPos: null
    } as any);

    const { container } = render(<MemoryGrid />);
    const blockDivs = container.querySelectorAll('.memory-block');
    expect(blockDivs.length).toBe(1);
  });
});
