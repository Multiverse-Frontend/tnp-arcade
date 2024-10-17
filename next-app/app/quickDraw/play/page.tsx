"use client";

import React, { useState, useRef, useEffect } from "react";

const drawingPrompts = [
  "A cat wearing sunglasses",
  "A robot having a picnic",
  "A flying car",
  "A tree house in space",
  "A penguin surfing",
  "A dragon reading a book",
  "A time machine shaped like a teapot",
  "A superhero eating ice cream",
  "A mermaid playing basketball",
  "A unicorn in a business suit",
  "A giraffe riding a motorcycle",
  "A fox painting a mural in a forest",
  "An octopus chef cooking in a kitchen",
  "A hamster astronaut floating in zero gravity",
  "A snail delivering letters on a skateboard",
  "A dinosaur playing chess with a squirrel",
  "A hedgehog gardening in a flower shop",
  "A lion DJing at a rooftop party",
  "A fairy with a jetpack exploring a city",
  "A walrus playing the piano on a beach",
  "A chameleon blending into a rainbow",
];

const timeLimitOptions = [5, 30, 45, 60, 90];

export default function QuickDrawPlay() {
  const [timeLimit, setTimeLimit] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"rate" | "endGame">("rate");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineWidth = 15;
        contextRef.current = context;
      }
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const resizeCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext("2d")?.drawImage(canvas, 0, 0);
      context.drawImage(tempCanvas, 0, 0);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endTurn();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(timeLimit);
    setCurrentPrompt(
      drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)]
    );
    setIsDrawingComplete(false);
    clearCanvas();
  };

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      const rect = canvas.getBoundingClientRect();
      const x =
        "touches" in event
          ? event.touches[0].clientX - rect.left
          : event.clientX - rect.left;
      const y =
        "touches" in event
          ? event.touches[0].clientY - rect.top
          : event.clientY - rect.top;
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      contextRef.current.strokeStyle = currentColor;
      setIsDrawing(true);
    }
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in event
        ? event.touches[0].clientX - rect.left
        : event.clientX - rect.left;
    const y =
      "touches" in event
        ? event.touches[0].clientY - rect.top
        : event.clientY - rect.top;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const rateDrawing = (rating: number) => {
    if (currentPlayer === 1) {
      setPlayer1Score((prevPlayer1Score) => prevPlayer1Score + rating);
      setCurrentPlayer(2);
    } else {
      setPlayer2Score((prevPlayer2Score) => prevPlayer2Score + rating);
      setCurrentPlayer(1);
    }
    setIsDrawingComplete(false);
    setShowModal(false);
    startGame();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
    if (contextRef.current) {
      contextRef.current.strokeStyle = e.target.value;
    }
  };

  const endTurn = () => {
    setIsPlaying(false);
    setIsDrawingComplete(true);
    setModalType("rate");
    setShowModal(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setModalType("endGame");
    setShowModal(true);
  };

  const resetGame = () => {
    setShowModal(false);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    clearCanvas();
    setIsPlaying(false);
    setCurrentPrompt("");
    setTimeLeft(timeLimit);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-4xl px-6 py-4 bg-[#2a0e20] rounded-lg shadow-lg">
        <div className="flex justify-between items-baseline mb-4">
          <h1 className="text-2xl font-bold text-pink-500">Quick Draw</h1>
          <div className="text-3xl font-semibold text-gray-300">
            Player {currentPlayer}'s Turn
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 border-2 border-pink-500 rounded-lg p-6 shadow-md">
          <select
            className="bg-[#421530] border border-pink-500 text-white text-sm rounded-lg p-2.5"
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            value={timeLimit}
          >
            {timeLimitOptions.map((option) => (
              <option key={option} value={option}>
                {option} seconds
              </option>
            ))}
          </select>
          <button
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-700 disabled:text-gray-900 disabled:cursor-not-allowed"
            onClick={startGame}
            disabled={isPlaying}
          >
            {isPlaying ? "Game in Progress" : "Start Game"}
          </button>
        </div>

        <div className="border-2 border-pink-500 p-10 rounded-lg shadow-md">
          <div className="text-start text-xl font-bold my-4 text-gray-300">
            Draw: {currentPrompt || "Press Start Game to begin"}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-gray-300">
              Time: {timeLeft}s
            </div>
            <div className="relative w-10 h-10">
              <input
                ref={colorPickerRef}
                type="color"
                value={currentColor}
                onChange={handleColorChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                style={{ backgroundColor: currentColor }}
                onClick={() => colorPickerRef.current?.click()}
              ></div>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={finishDrawing}
            onTouchMove={draw}
            className="border-2 border-pink-500 rounded-md cursor-crosshair w-full h-80 touch-none bg-black"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="border border-pink-500 hover:bg-pink-500 text-white font-bold py-2 px-5 rounded"
            onClick={clearCanvas}
          >
            Clear Canvas
          </button>
          <div className="flex gap-2">
            <button
              className="bg-pink-300 hover:bg-pink-400 text-white font-bold py-2 px-5 rounded"
              onClick={endTurn}
            >
              End Turn
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-5 rounded"
              onClick={endGame}
            >
              End Game
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-5 text-xl font-semibold text-white">
          <p>Player 1 score: {player1Score}</p>
          <p>Player 2 score: {player2Score}</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#2a0e20] p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-500">
                {modalType === "rate" ? "Rate the Drawing" : "Game Over"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300 hover:text-white"
              >
                &#x2715;
              </button>
            </div>
            {modalType === "rate" ? (
              <div className="text-center space-y-4">
                <p className="text-lg text-white">
                  Rate Player {currentPlayer}'s drawing:
                </p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => rateDrawing(rating)}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-lg text-white">Final Scores:</p>
                <p className="text-white">Player 1: {player1Score}</p>
                <p className="text-white">Player 2: {player2Score}</p>
                <p className="text-xl font-bold text-pink-500">
                  Winner:{" "}
                  {player1Score > player2Score
                    ? "Player 1"
                    : player1Score < player2Score
                    ? "Player 2"
                    : "It's a tie!"}
                </p>
                <button
                  onClick={resetGame}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  New Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
