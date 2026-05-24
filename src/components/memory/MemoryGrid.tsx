import React from 'react';
import { MemoryBlock } from './MemoryBlock';
import { useMemoryGame } from '../../hooks/useMemoryGame';
import './MemoryGrid.scss';

export const MemoryGrid: React.FC = () => {
  const { memoryGrid } = useMemoryGame();

  if (!memoryGrid) return null;

  return (
    <div className="memory-grid">
      {memoryGrid.map((m, index) => (
        <div key={m.pos !== undefined ? m.pos : index} className="grid-item">
          <MemoryBlock memoryBlock={m} />
        </div>
      ))}
    </div>
  );
};
