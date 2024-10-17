"use client";

import { useState } from "react";
import Image from "next/image";
import "./page.module.css";
import { useRouter } from 'next/navigation';
import { ArrowBackOutline, ArrowForwardOutline } from 'react-ionicons';
import gameImages from "./arcadeImages.json"; 

export default function Home() {
  const router = useRouter();
  const [currentGame, setCurrentGame] = useState(gameImages[1]);
  const [gameIndex, setGameIndex] = useState(0);

  function toggleGames() {
    // Increment the game index each click
    let newIndex = gameIndex + 1;

    // Reset the game index to 0 if it exceeds the length of the array
    if (newIndex >= gameImages.length) {
      newIndex = 0;
    }

    console.log(gameImages[newIndex]);
    setCurrentGame(gameImages[newIndex]);
    setGameIndex(newIndex);
  }

  function routeGames() {
    if (currentGame.name === "fidget-popper") {
      router.push('/fidget-popper');
    } else if (currentGame.name === "memory-game") {
      router.push('/memory-game');
    } else if (currentGame.name === "quick-draw") {
      router.push('/quick-draw');
    }
  }

  return (
    <div id="home-page">
      <h1>TNP Arcade</h1>
      <p>Choose a game!</p><br/>

      <div style={{display: 'flex', justifyContent: 'center'}}>
      <button className="nav-arrows" onClick={() => toggleGames()}>
      <ArrowBackOutline
            color={'#ffffff'} 
            height="55px"
            width="55px"
          />
        </button>
        <div id="machine-img-div">
            <Image src={currentGame.imageURL} alt="Arcade Machine" width={800} height={850}/>
        </div>
        <button className="nav-arrows" onClick={() => toggleGames()}>
          <ArrowForwardOutline
            color={'#ffffff'} 
            height="55px"
            width="55px"
          />
        </button>
      </div>
      <button onClick={() => routeGames()}>PLAY GAME</button>
    </div>
  );
}
