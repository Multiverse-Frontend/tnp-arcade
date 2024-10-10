"use client";

import React, { useState } from "react";
import { GameProvider } from "./GameContext"
import SelectPopper from "./select-popper/page";
import PlayGame from "./play-game/page";

function FidgetPopper() {
    const [selectView, setSelectView] = useState(true);
    const [playView, setPlayView] = useState(false);
    
    return (
        <GameProvider>
            <h1 style={{textTransform: 'uppercase', margin: '2em 2em 0 2em', textAlign: 'center'}}>Fidget Popper</h1>

            {selectView && (
                <SelectPopper selectView={selectView} setSelectView={setSelectView} setPlayView={setPlayView} />                
            )}
            {playView && (
                <PlayGame setSelectView={setSelectView} setPlayView={setPlayView} />
            )}
        </GameProvider>
    )
}

export default FidgetPopper;