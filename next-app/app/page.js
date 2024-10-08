// TNP-ARCADE/app/page.js
"use client"; // Add this line to indicate a client component

import React, { useState } from 'react';
import MemoryGamePage from './memoryGame/page';

const HomePage = () => {
  const [showMemoryGame, setShowMemoryGame] = useState(false);

  const handleButtonClick = () => {
    setShowMemoryGame(true);
  };

  return (
    <div>
      <h1>Welcome to TNP Arcade</h1>
      <p>Choose a game!</p>
      <button onClick={handleButtonClick}>Play Memory Game</button>
      {showMemoryGame && <MemoryGamePage />}
    </div>
  );
};

export default HomePage;