"use client";

import { useEffect, useState } from 'react';
// Import Style Sheet
import './popperSelect.css'


function SelectPopper() {
    const [currentPopper, setCurrentPopper] = useState(null);
    const [allPopperData, setAllPopperData] = useState(null);

    // If user selects popper, access data from JSON file
    useEffect(() => {
        const getPopperData = async () => {
            const popperData = require('./popperData.json');
            console.log(popperData); // Log the entire popperData array
            setAllPopperData(popperData);
            setCurrentPopper(popperData[0]['sea-turtle'])
        };
    
        getPopperData();
    }, []);


    function setPopper(popper) {
        setCurrentPopper(null);
        if (Array.isArray(allPopperData) && allPopperData.length > 0) {
            // Loop through allPopperData array to find the selected popper
            allPopperData && allPopperData.forEach((data, idx) => {
                if (data.hasOwnProperty(popper)) {
                    const selectedPopper = data[popper];
                    console.log(selectedPopper); 
                    console.log(selectedPopper.bubbleCount);
                    console.log(selectedPopper.bubbleColor);
                    console.log(selectedPopper.name); 
                    console.log(selectedPopper.image);
                    setCurrentPopper(selectedPopper);
                } else {
                    console.error("popperData is not an array or is empty");
                }
            });
        }
    }

    return (
        <div className="main-div">
            <h1>Fidget Popper</h1>

            <div className="popper-container">
                <div className='popper-options'>
                    {/* Map through allPopperData array */}
                    {allPopperData && allPopperData.map((data, index) => {
                        // Map through each popper object in the array
                        return Object.keys(data).map((popper, idx) => {
                            return (
                                <button key={idx} id={popper} value={popper} style={{border: `3px solid ${data[popper].theme} `}} onClick={() => setPopper(popper)}>
                                    <img src={data[popper].image} alt={data[popper].name} />
                                </button>
                            )
                    })})}
                </div>

                <div className="bubbles" id={currentPopper && currentPopper.name === 'butterfly' && 'butterfly-bubbles'} style={{top: currentPopper ? `${currentPopper.top}` : "58%" }}>
                    {/* Create bubbles for bubble count value from JSON */}
                    {currentPopper && currentPopper.rowPattern && (() => {
                        const rowPattern = currentPopper.rowPattern;
                        let bubbleIndex = 0;
                        return rowPattern.map((count, rowIndex) => (
                            <div key={rowIndex} className="bubble-row">
                                {Array.from({ length: count }).map((_, colIndex) => {
                                    return (
                                        <button key={bubbleIndex++} style={{ backgroundColor: currentPopper.bubbleColor, width: currentPopper.bubbleSize, height: currentPopper.bubbleSize }} className="bubble"></button>
                                    );
                                })}
                            </div>
                        ));
                    })()}
                </div>
                <div className="default-popper">
                    {currentPopper ? (
                        <img src={`${currentPopper.image}`} alt={currentPopper.name} /> 
                    ) : (
                        <img src='/turtle-popper.png' alt='Turtle Popper' />
                    )}
                </div>
            </div>

            <div>
                <button id="select-popper" className='btn btn-warning'>Select</button>
            </div>
        </div>
    )
}

export default SelectPopper;