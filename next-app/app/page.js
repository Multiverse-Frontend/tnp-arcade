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

  function toggleGamesRightBtn() {
    // Increment the game index each click
    let newIndex = gameIndex + 1;

    // Reset the game index to 0 if it exceeds the length of the array
    if (newIndex >= gameImages.length) {
      newIndex = 0;
    }
    setCurrentGame(gameImages[newIndex]);
    setGameIndex(newIndex);
  }

  function toggleGamesLeftBtn() {
    // Decrement the game index each click
    let newIndex = gameIndex - 1;

    // Reset the game index to the last index if it goes below 0
    if (newIndex < 0) {
      newIndex = gameImages.length - 1;
    }
    setCurrentGame(gameImages[newIndex]);
    setGameIndex(newIndex);
  }

  function routeGames() {
    if (currentGame.name === "fidget-popper") {
      router.push('/fidgetPopper');
    } else if (currentGame.name === "memory-game") {
      router.push('/'); // Change to correct route
    } else if (currentGame.name === "quick-draw") {
      router.push('/'); // Change to correct route
    }
  }

  return (
    <div id="home-page">
      <h1>TNP Arcade</h1>
      <p>Choose a game!</p><br/>

      <div style={{display: 'flex', justifyContent: 'center'}}>
      <button className="nav-arrows" onClick={() => toggleGamesLeftBtn()}>
      <ArrowBackOutline
            color={'#ffffff'} 
            height="55px"
            width="55px"
          />
        </button>
        <div id="machine-img-div">
            <Image src={currentGame.imageURL} alt="Arcade Machine" width={800} height={850}/>
        </div>
        <button className="nav-arrows" onClick={() => toggleGamesRightBtn()}>
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
