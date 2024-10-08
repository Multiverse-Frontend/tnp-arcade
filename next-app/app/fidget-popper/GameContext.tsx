"use client";

import React, { createContext, useState } from "react";

// Define the type for the context using an interface
interface GameContextType {
    currentPopper: any;
    setCurrentPopper: any;
}

// Provide a default value for the context 
const defaultGameContext: GameContextType = {
    currentPopper: null,
    setCurrentPopper: () => {}
}

export const GameContext = createContext<GameContextType>(defaultGameContext);

export const GameProvider = ({ children }) => {
    const [currentPopper, setCurrentPopper] = useState(null);

    return (
        <GameContext.Provider value={{ currentPopper, setCurrentPopper }}>
            {children}
        </GameContext.Provider>
    );
};