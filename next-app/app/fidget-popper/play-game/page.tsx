"use client";

import Image from "next/image";
import React, { useContext } from "react";
import { GameContext } from "../GameContext";
import './playGame.css'


function PlayGame() {
    const { currentPopper } = useContext(GameContext);

    // Start Game
    function start() {
        console.log(currentPopper);
    }

    // Calculate Time

    // Calculate Score

    return (
        <>
        <h1 style={{textAlign: 'center', marginTop: '2em'}}>FIDGET POPPER</h1>
        <div className="content">
            <div id="game-play">
                <div className="popper-container">
                    {currentPopper && 
                        <Image src={currentPopper.image} alt={currentPopper.name} width={200} height={200}/>
                    }
                </div>
            </div>
            
            <div id="right-side">
                <button id="start-game-btn" onClick={start} style={{backgroundColor: currentPopper && currentPopper.theme}}>Start Game</button>
                <div id="stats" style={currentPopper && {borderColor: currentPopper.theme}}>
                    <div id="time">
                        <h5>Time</h5>
                        <p>00:00</p>
                    </div>
                    <div id="score">
                        <h5>Score</h5>
                        <p>00000</p>
                    </div>
                    <div id="high-score">
                        <h5>High Score</h5>
                        <p>00000</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PlayGame;