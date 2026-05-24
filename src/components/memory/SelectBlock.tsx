import React from 'react';
import { Colours } from '../../interfaces/colours';
import { useMemoryGame } from '../../hooks/useMemoryGame';
import './SelectBlock.scss';

interface SelectBlockProps {
  colourPos: number;
}

export const SelectBlock: React.FC<SelectBlockProps> = ({ colourPos }) => {
  const { setDraggedColourPos } = useMemoryGame();

  const getStyle = () => {
    return { backgroundColor: Colours[colourPos] };
  };

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedColourPos(colourPos);
    e.dataTransfer.setData('text/plain', colourPos.toString());
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedColourPos(null);
  };

  return (
    <div className="select-block-container">
      {/* 1. Static layer: Always at the bottom */}
      <div style={getStyle()} className="static-layer" />

      {/* 2. Drag layer: Handles user interaction */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={getStyle()}
        className="drag-layer"
      />
    </div>
  );
};
