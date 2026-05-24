import React from 'react';
import { SelectBlock } from './SelectBlock';
import { useMemoryGame } from '../../hooks/useMemoryGame';
import './SelectGrid.scss';

export const SelectGrid: React.FC = () => {
  const { colourSelect } = useMemoryGame();
  
  // Creates an array of size colourSelect containing indices [0, 1, 2, ...]
  const selectGrid = Array.from({ length: colourSelect }, (_, i) => i);

  return (
    <div 
      className="select-grid" 
      style={{ gridTemplateColumns: `repeat(${colourSelect}, 40px)` }}
    >
      {selectGrid.map((i) => (
        <div key={i} className="square-container">
          <SelectBlock colourPos={i} />
        </div>
      ))}
    </div>
  );
};
