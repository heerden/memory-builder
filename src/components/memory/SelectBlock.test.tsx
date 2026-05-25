import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SelectBlock } from './SelectBlock';
import { MemoryGameProvider, useMemoryGame } from '../../context/MemoryGameContext';
import { Colours } from '../../interfaces/colours';

// A consumer helper component to retrieve context states for verification
const ContextConsumer: React.FC = () => {
  const { draggedColourPos } = useMemoryGame();
  return <div data-testid="dragged-pos">{String(draggedColourPos)}</div>;
};

describe('SelectBlock Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with correct color background based on colourPos', () => {
    const { container } = render(
      <MemoryGameProvider>
        <SelectBlock colourPos={1} />
      </MemoryGameProvider>
    );

    // Get the block elements
    const staticLayer = container.querySelector('.static-layer') as HTMLElement;
    const dragLayer = container.querySelector('.drag-layer') as HTMLElement;

    expect(staticLayer).not.toBeNull();
    expect(dragLayer).not.toBeNull();

    // Verify background colors map to Colours[1]
    expect(staticLayer.style.backgroundColor).toBe(Colours[1].toLowerCase());
    expect(dragLayer.style.backgroundColor).toBe(Colours[1].toLowerCase());
  });

  it('should set draggedColourPos and setup dataTransfer on drag start, and clear it on drag end', () => {
    render(
      <MemoryGameProvider>
        <SelectBlock colourPos={2} />
        <ContextConsumer />
      </MemoryGameProvider>
    );

    const dragLayer = document.querySelector('.drag-layer') as HTMLElement;
    const draggedPosDiv = screen.getByTestId('dragged-pos');

    expect(draggedPosDiv.textContent).toBe('null');

    // Mock dataTransfer object
    const mockDataTransfer = {
      setData: vi.fn(),
      effectAllowed: 'none'
    };

    // Trigger dragstart
    fireEvent.dragStart(dragLayer, { dataTransfer: mockDataTransfer });

    // Verify state updated in context
    expect(draggedPosDiv.textContent).toBe('2');
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('text/plain', '2');
    expect(mockDataTransfer.effectAllowed).toBe('copy');

    // Trigger dragend
    fireEvent.dragEnd(dragLayer);

    // Verify state cleared in context
    expect(draggedPosDiv.textContent).toBe('null');
  });
});
