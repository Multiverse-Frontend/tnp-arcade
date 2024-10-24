"use client";

import React, { useContext } from "react";
import { GameContext } from "../GameContext";

interface ActiveBubblesProps {
    handleBubbleClick: (bubbleIndex: number, bubble: Element) => void;
    activeBubbles: number[];
    setActiveBubbles: any;
}

export function selectBubbles(currentPopper: any, setActiveBubbles: (bubbles: number[]) => void) {
  const bubbleCount = currentPopper.bubbleCount;
  const newActiveBubbles: number[] = [];

  // While activeBubbles is less than half of bubbleCount...
  while (newActiveBubbles.length < bubbleCount / 2) {
    // Generate a random number between 0 and bubbleCount
    const randomBubble = Math.floor(Math.random() * bubbleCount);
    // If activeBubbles does not include the randomBubble...
    if (!newActiveBubbles.includes(randomBubble)) {
      // Push the randomBubble to activeBubbles
      newActiveBubbles.push(randomBubble);
    }
  }
  setActiveBubbles(newActiveBubbles);
}


function ActiveBubbles( { activeBubbles, handleBubbleClick }: ActiveBubblesProps ) {
  const { currentPopper } = useContext(GameContext);

  return (
    <>
      <div
        className="bubbles"
        style={{
          top: currentPopper && `${currentPopper.top}`,
          left: currentPopper && `${currentPopper.left}`,
        }}
      >
        {currentPopper &&
          currentPopper.rowPattern &&
          (() => {
            // Access the rowPattern array from the currentPopper object
            const rowPattern = currentPopper.rowPattern;
            let bubbleIndex = -1;
            // Map through the rowPattern array to create rows and bubbles
            return rowPattern.map((count: number, rowIndex: number) => (
              <div key={rowIndex} className="bubble-row">
                {/* Create bubbles for each row using the count value */}
                {Array.from({ length: count }).map((_, colIndex) => {
                  bubbleIndex++;
                  // Set currentIndex to bubbleIndex to maintain unique key values
                  const currentIndex = bubbleIndex;
                  return (
                    <button
                      key={currentIndex}
                      style={{
                        backgroundColor: activeBubbles.includes(currentIndex) ? currentPopper.bubbleColor : "grey",
                        border: activeBubbles.includes(currentIndex) ? `3px solid white` : 'none',
                        width: currentPopper.bubbleSize,
                        height: currentPopper.bubbleSize,
                      }}
                      className="bubble"
                      onClick={(e) => handleBubbleClick(currentIndex, e.currentTarget)}>
                      {/* {currentIndex} */}
                    </button>
                  );
                })}
              </div>
            ));
          })()}
      </div>
    </>
  );
}

export default ActiveBubbles;