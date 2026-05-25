import { render, fireEvent, createEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryBlock } from './MemoryBlock';
import { useMemoryGame } from '../../hooks/useMemoryGame';
import { Colours, ColourContrasts } from '../../interfaces/colours';

vi.mock('../../hooks/useMemoryGame', () => ({
  useMemoryGame: vi.fn()
}));

describe('MemoryBlock Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should render standard block style when question and wrong are both false', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: true,
      draggedColourPos: null,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 2, question: false, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);

    const blockDiv = container.querySelector('.memory-block') as HTMLElement;
    expect(blockDiv).not.toBeNull();
    expect(blockDiv.style.backgroundColor).toBe(Colours[2].toLowerCase());
    expect(blockDiv.style.border).toBe('2px solid black');
  });

  it('should render question block style when question is true', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: null,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);

    const blockDiv = container.querySelector('.memory-block') as HTMLElement;
    expect(blockDiv.style.border).toBe('2px dashed red');
  });

  it('should render wrong block style when wrong is true', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: true,
      draggedColourPos: null,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 1, question: false, wrong: true };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);

    const blockDiv = container.querySelector('.memory-block') as HTMLElement;
    expect(blockDiv.style.backgroundColor).toBe(Colours[1].toLowerCase());
    expect(blockDiv.style.border).toBe(`3px dashed ${ColourContrasts[1].toLowerCase()}`);
  });

  it('should update preview color on dragenter when not memorising, and clear it on dragleave', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: 4,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    // Trigger dragenter
    fireEvent.dragEnter(blockDiv);

    // Check that the preview color is shown
    expect(blockDiv.style.backgroundColor).toBe(Colours[4].toLowerCase());
    expect(blockDiv.style.border).toBe('2px solid black');

    // Trigger dragleave
    fireEvent.dragLeave(blockDiv);

    // Style resets to question block (dashed red)
    expect(blockDiv.style.border).toBe('2px dashed red');
  });

  it('should not update preview color on dragenter if draggedColourPos is null', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: null,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    // Trigger dragenter
    fireEvent.dragEnter(blockDiv);

    // Background stays empty/transparent (not previewed)
    expect(blockDiv.style.backgroundColor).toBe('');
  });

  it('should ignore dragenter/dragover when memorising', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: true,
      draggedColourPos: 4,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    // Trigger dragenter
    fireEvent.dragEnter(blockDiv);
    expect(blockDiv.style.backgroundColor).toBe(''); // No preview set (it is memorising)

    // Trigger dragover and assert preventDefault was not called
    const dragOverEvent = createEvent.dragOver(blockDiv);
    vi.spyOn(dragOverEvent, 'preventDefault');
    fireEvent(blockDiv, dragOverEvent);
    expect(dragOverEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should call preventDefault on dragover when not memorising', () => {
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: null,
      updateMemoryGrid: vi.fn()
    } as any);

    const mockBlock = { pos: 0, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    const dragOverEvent = createEvent.dragOver(blockDiv);
    vi.spyOn(dragOverEvent, 'preventDefault');
    fireEvent(blockDiv, dragOverEvent);
    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
  });

  it('should call updateMemoryGrid on drop with the correct colour pos', () => {
    const mockUpdateMemoryGrid = vi.fn();
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: null,
      updateMemoryGrid: mockUpdateMemoryGrid
    } as any);

    const mockBlock = { pos: 2, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    // Trigger drop
    const mockGetData = vi.fn().mockReturnValue('5');
    fireEvent.drop(blockDiv, {
      dataTransfer: {
        getData: mockGetData
      }
    });

    expect(mockGetData).toHaveBeenCalledWith('text/plain');
    expect(mockUpdateMemoryGrid).toHaveBeenCalledWith(2, 5, false);
    // Preview color gets reset to null on drop
    expect(blockDiv.style.border).toBe('2px dashed red');
  });

  it('should not call updateMemoryGrid on drop if isMemorising is true or transfer data is empty', () => {
    const mockUpdateMemoryGrid = vi.fn();
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: true,
      draggedColourPos: null,
      updateMemoryGrid: mockUpdateMemoryGrid
    } as any);

    const mockBlock = { pos: 2, colourPos: 3, question: true, wrong: false };
    const { container } = render(<MemoryBlock memoryBlock={mockBlock} />);
    const blockDiv = container.querySelector('.memory-block') as HTMLElement;

    // Try drop when isMemorising is true
    fireEvent.drop(blockDiv, {
      dataTransfer: {
        getData: () => '5'
      }
    });
    expect(mockUpdateMemoryGrid).not.toHaveBeenCalled();

    // Set isMemorising to false, but provide empty data transfer
    vi.mocked(useMemoryGame).mockReturnValue({
      isMemorising: false,
      draggedColourPos: null,
      updateMemoryGrid: mockUpdateMemoryGrid
    } as any);

    fireEvent.drop(blockDiv, {
      dataTransfer: {
        getData: () => ''
      }
    });
    expect(mockUpdateMemoryGrid).not.toHaveBeenCalled();
  });
});
