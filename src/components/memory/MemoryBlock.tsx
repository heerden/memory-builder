import React, { useState } from 'react';
import { Colours, ColourContrasts } from '../../interfaces/colours';
import { useMemoryGame } from '../../hooks/useMemoryGame';
import './MemoryBlock.scss';

interface MemoryBlockProps {
  memoryBlock: {
    pos: number;
    colourPos: number;
    question: boolean;
    wrong: boolean;
  };
}

export const MemoryBlock: React.FC<MemoryBlockProps> = ({ memoryBlock }) => {
  const { pos, colourPos, question, wrong } = memoryBlock;
  const { isMemorising, draggedColourPos, updateMemoryGrid } = useMemoryGame();

  const [previewColourPos, setPreviewColourPos] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (isMemorising) return;
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (isMemorising) return;
    e.preventDefault();
    if (draggedColourPos !== null) {
      setPreviewColourPos(draggedColourPos);
    }
  };

  const handleDragLeave = () => {
    setPreviewColourPos(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isMemorising) return;
    e.preventDefault();
    setPreviewColourPos(null);
    const dataStr = e.dataTransfer.getData('text/plain');
    if (dataStr !== '') {
      const droppedColourPos = Number(dataStr);
      updateMemoryGrid(pos, droppedColourPos, false);
    }
  };

  const getStyle = () => {
    if (previewColourPos !== null) {
      return { backgroundColor: Colours[previewColourPos], border: '2px solid black' };
    }

    if (question) {
      return { border: '2px dashed red' };
    } else if (wrong) {
      return {
        backgroundColor: Colours[colourPos],
        border: `3px dashed ${ColourContrasts[colourPos]}`,
        boxSizing: 'border-box' as const
      };
    } else {
      return { backgroundColor: Colours[colourPos], border: '2px solid black' };
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={getStyle()}
      className="memory-block"
    />
  );
};
