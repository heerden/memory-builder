import React from 'react';
import { Slider } from '../shared/Slider';
import { useMemoryGame } from '../../hooks/useMemoryGame';

export const Settings: React.FC = () => {
  const {
    startGrid,
    setStartGrid,
    increaseGrid,
    setIncreaseGrid,
    colourSelect,
    setColourSelect,
    roundTime,
    setRoundTime,
    penaltyTime,
    setPenaltyTime
  } = useMemoryGame();

  return (
    <div className="box">
      <p className="heading">Settings</p>

      <div>Number of blocks to start with: {startGrid}</div><br />
      <Slider
        value={startGrid}
        min={3}
        max={110}
        step={1}
        onChange={setStartGrid}
      /><br />

      <div>Number of blocks to increase after every round: {increaseGrid}</div><br />
      <Slider
        value={increaseGrid}
        min={1}
        max={5}
        step={1}
        onChange={setIncreaseGrid}
      /><br />

      <div>Number of colours to use: {colourSelect}</div><br />
      <Slider
        value={colourSelect}
        min={3}
        max={8}
        step={1}
        onChange={setColourSelect}
      /><br />

      <div>Memorising time added after each round: {roundTime}</div><br />
      <Slider
        value={roundTime}
        min={1}
        max={7}
        step={1}
        onChange={setRoundTime}
      /><br />

      <div>Memorising penalty time reduced after incorrect answer: {penaltyTime}</div><br />
      <Slider
        value={penaltyTime}
        min={1}
        max={3}
        step={1}
        onChange={setPenaltyTime}
      /><br />
    </div>
  );
};
