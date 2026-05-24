import React, { useState, useEffect } from 'react';
import { SelectGrid } from './SelectGrid';
import { Settings } from './Settings';
import { MemoryGrid } from './MemoryGrid';
import { useMemoryGame } from '../../hooks/useMemoryGame';

export const MemoryGame: React.FC = () => {
  const {
    round,
    blocks,
    isMemorising,
    statusMessage,
    memInterval,
    startGame,
    restart,
    nextRound,
    startRound
  } = useMemoryGame();

  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const val = sessionStorage.getItem('memory_builder_hide_info');
        if (val === 'true') {
          setShowInfo(false);
        }
      } catch (e) {
        console.error('Error reading info visibility state from sessionStorage', e);
      }
    }
  }, []);

  const closeInfo = () => {
    setShowInfo(false);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('memory_builder_hide_info', 'true');
      } catch (e) {
        console.error('Error saving info visibility state to sessionStorage', e);
      }
    }
  };

  return (
    <div className="container">
      <div className="level mb-4">
        <div className="level-left"></div>
        <div className="level-right">
          {round > 0 && (
            <button className="button is-warning is-light" onClick={restart}>
              Restart
            </button>
          )}
        </div>
      </div>

      <br />

      {showInfo && (
        <div className="notification is-info" style={{ position: 'relative' }}>
          Remember the sequence of blocks and build them out as it grows. Drag and drop the colour blocks to the question grid.
          <button className="delete" onClick={closeInfo} aria-label="close"></button>
        </div>
      )}

      <div className="columns has-text-centered">
        <div className="column is-one-third">
          <div className="box">
            <p className="heading">Status</p>
            <p className="title">{statusMessage}</p>
          </div>
        </div>
        
        {round > 0 && (
          <>
            <div className="column">
              <div className="box">
                <div className="heading">Round</div>
                <div className="title">{round}</div>
              </div>
            </div>
            
            <div className="column">
              <div className="box">
                <div className="heading">Blocks</div>
                <div className="title">{blocks}</div>
              </div>
            </div>
            
            <div className="column">
              <div className="box">
                <p className="heading">
                  {memInterval > 0 ? 'Memorise Time (s)' : 'Penalty Time (s)'}
                </p>
                <p className="title">{memInterval}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="has-text-centered mb-5">
        {round === 0 && (
          <button className="button is-primary is-large" onClick={startGame}>
            Start
          </button>
        )}
        {round > 0 && !isMemorising && (
          <button className="button is-link is-large" onClick={nextRound}>
            Next Round
          </button>
        )}
        {round > 0 && isMemorising && (
          <button className="button is-success is-large" onClick={startRound}>
            Start Round
          </button>
        )}
      </div>

      <div className="is-flex is-justify-content-start">
        <SelectGrid />
      </div>

      <br />

      {round === 0 && (
        <div>
          <br />
          <Settings />
        </div>
      )}

      <br />

      {round > 0 && (
        <div className="is-flex is-justify-content-start">
          <MemoryGrid />
        </div>
      )}
    </div>
  );
};
export default MemoryGame;
