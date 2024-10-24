"use client";

import Image from "next/image";
import { ArrowBackOutline } from 'react-ionicons'
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../GameContext";
import { useRouter } from "next/navigation";

import "./popperSelect.css";

interface SelectPopperProps {
    selectView: boolean;
    setSelectView: any;
    setPlayView: any;
}

function SelectPopper({ selectView, setSelectView, setPlayView }: SelectPopperProps) {
  const { currentPopper, setCurrentPopper } = useContext(GameContext);
//   const { gameIsStarted, setGameIsStarted } = useContext(GameContext);
  const [allPopperData, setAllPopperData] = useState(null);
  const router = useRouter();

  // If user selects popper, access data from JSON file
  useEffect(() => {
    const getPopperData = async () => {
      const popperData = require("./popperData.json");
    //   console.log(popperData); // Log the entire popperData array
      setAllPopperData(popperData);
      setCurrentPopper(popperData[0]['sea-turtle']);
    };

    getPopperData();
  }, [setCurrentPopper]);

  function setPopper(popper: string) {
    // Reset currentPopper state
    setCurrentPopper(null);
    // Check if allPopperData is an array and not empty
    if (Array.isArray(allPopperData) && allPopperData.length > 0) {
      // Loop through allPopperData array to find the selected popper
      allPopperData &&
        allPopperData.forEach((data, idx) => {
          // Check if the selected popper exists in the data object
          if (data.hasOwnProperty(popper)) {
            // Set currentPopper state to the selected popper
            const selectedPopper = data[popper];
            setCurrentPopper(selectedPopper);
          }
        });
    } else {
      console.error("popperData is not an array or is empty");
    }
  }

  function handleSelectClick() {
    if (currentPopper) {
        setSelectView(false);
        setPlayView(true);
      // router.push("/fidget-popper/play-game");
    } else {
      const errorMessage = document.getElementById("error-message");
      errorMessage.innerHTML = "Please select a popper";
      errorMessage.style.color = "red";
    }
  }

  return (
    <>
    <button id="back-btn" onClick={() => router.push("./")}>
      <ArrowBackOutline
      color={'#ffffff'} 
      height="35px"
      width="35px"
      />
    </button>

    <div className="main-div">

      <div className="popper-container">

        <div className="popper-options">
          {/* Map through allPopperData array */}
          {allPopperData &&
            allPopperData.map((data: object, index: number) => {
              // Map through each popper object in the array
              return Object.keys(data).map((popper, idx) => {
                // Return a button for each popper object with corresponding style and image
                return (
                  <button key={idx} id={popper} value={popper}
                    style={{ border: `3px solid ${data[popper].theme} ` }}
                    onClick={() => setPopper(popper)}>
                    <Image
                      src={data[popper].image}
                      alt={data[popper].name}
                      width={100} height={100}
                    />
                  </button>
                );
              });
            })}
        </div>
        
        <div className="default-popper">
          {currentPopper ? (
            <Image
              src={`${currentPopper.image}`}
              alt={currentPopper.name}
              width={200} height={200}
            />
          ) : (
            <Image
              src="/turtle-popper.png"
              alt="Turtle Popper"
              width={200} height={200}
            />
          )}
        </div>
      </div>

      <div>
        <button id="select-popper" className="bg-white text-black" onClick={handleSelectClick}>Select</button>
        <div id="error-message"></div>
      </div>
    </div>
    </>
  );
}

export default SelectPopper;
