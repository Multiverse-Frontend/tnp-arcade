"use client";

import Image from "next/image";
import React, { useContext, useState, useEffect, useRef } from "react";
import { ArrowBackOutline } from 'react-ionicons'
import { GameContext } from "../GameContext";
import ActiveBubbles, { selectBubbles } from "./ActiveBubbles";

import './playGame.css'

// Define the PlayGameProps interface
interface PlayGameProps {
    setSelectView: any;
    setPlayView: any;
}


const PlayGame: React.FC<PlayGameProps> = ({ setSelectView, setPlayView }) => {
    const { currentPopper } = useContext(GameContext);
    const [time, setTime] = useState(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [ gameIsStarted, setGameIsStarted ] = useState(false);
    const [activeBubbles, setActiveBubbles] = useState([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);    

    useEffect(() => {
        if (gameIsStarted) {
            startGame();
        } else {
            clearInterval(timerRef.current!);
        }
    }, [gameIsStarted]);


    // Start Game
    function startGame() {
        setActiveBubbles([]);
        setScore(0);

        // Select Bubbles
        selectBubbles(currentPopper, setActiveBubbles);

        // Set Timer
        let seconds = 30;
        setTime(seconds);
        timerRef.current = setInterval(() => {
            seconds--;
            setTime(seconds);

            if (seconds === 0) {
                clearInterval(timerRef.current!);
                endGame();
            }
        }, 1000);
    }


    // Handles the click event on the bubble
    function handleBubbleClick(bubbleIndex: number, bubble: Element) {
        if (!gameIsStarted) return;


        // Check if the bubble is active
        if (!activeBubbles.includes(bubbleIndex)) {
            endGame();
            return;
        }

        setActiveBubbles((prevActiveBubbles) => {
            const newActiveBubbles = prevActiveBubbles.filter(index => index !== bubbleIndex);

            // Re-execute selectBubbles when activeBubbles is empty
            if (newActiveBubbles.length === 0) {
                setHighScore((prevHighScore) => (score > prevHighScore ? score : prevHighScore));                
                selectBubbles(currentPopper, setActiveBubbles);
            }
            return newActiveBubbles;
        });

        setScore((prevScore) => prevScore + 10);
        (bubble as HTMLElement).style.backgroundColor = 'grey';
    }


    // Ends the game
    function endGame() {
        setGameIsStarted(false);
        clearInterval(timerRef.current!);
        setActiveBubbles([]);
        setHighScore((prevHighScore) => (score > prevHighScore ? score : prevHighScore));
        setScore(0);
        setTime(null);

        // Reset bubble color to grey
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach((bubble, idx) => {
            (bubble as HTMLElement).style.backgroundColor = 'grey';
        });        
    }


    return (
        <>
        <button id="back-btn" onClick={() => window.location.reload()}>
            <ArrowBackOutline
            color={'#ffffff'} 
            height="35px"
            width="35px"
            /> 
        </button>
        <div className="content">
            <div id="game-play">
                <ActiveBubbles handleBubbleClick={handleBubbleClick} activeBubbles={activeBubbles} setActiveBubbles={setActiveBubbles}/>

                <div id="selected-popper">
                    {currentPopper && 
                        <Image src={currentPopper.image} alt={currentPopper.name} width={700} height={700}/>
                    }
                </div>

            </div>
            
            <div id="right-side">
                {!gameIsStarted ? (
                    <button id="start-game-btn" onClick={() => setGameIsStarted(true)} style={{backgroundColor: currentPopper && currentPopper.theme}}>Start Game</button>
                ) : (
                    <button id="end-game-btn" onClick={endGame} style={{backgroundColor: currentPopper && currentPopper.theme}}>End Game</button>
                )}

                {/* Game Stats */}
                <div id="stats" style={currentPopper && {borderColor: currentPopper.theme}}>
                    <div id="time">
                        <h5>Time</h5>
                        <p style={{color: Number(time) <= 20 && Number(time) >= 11 ? 'yellow' : Number(time) < 11 ? 'red' : time === null && 'white'}}>{time === null ? '00:00' : time > 9 ? '00:' + time : '00:0' + time}</p>
                    </div>
                    <div id="score">
                        <h5>Score</h5>
                        <p>{score === 0 ? '00000' : score >= 100 ? '00' + score : '000' + score}</p>
                    </div>
                    <div id="high-score">
                        <h5>High Score</h5>
                        <p>{highScore === 0 ? '00000' : highScore >= 100 ? '00' + highScore : '000' + highScore}</p>
                    </div>
                </div>
            </div>
        </div>

        </>
    )
}

export default PlayGame;