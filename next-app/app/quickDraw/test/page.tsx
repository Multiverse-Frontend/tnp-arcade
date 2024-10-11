"use client";

import { clear } from "console";
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
];

const colorOptions = [
  { name: "Black", value: "white" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Yellow", value: "#be185d" },
  { name: "Purple", value: "#c1ff72" },
];

const timeLimitOptions = [30, 45, 60, 90];

export default function QuickDrawArcade() {
  const [timeLimit, setTimeLimit] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineWidth = 10;
        contextRef.current = context;
      }
      // Set canvas size to match its display size
      resizeCanvas();
      // Add event listener for window resize
      window.addEventListener("resize", resizeCanvas);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (clearCanvas) {
      if (contextRef.current) {
        contextRef.current.clearRect(
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );
        canvasRef.current!.width = canvasRef.current!.width;
        canvasRef.current!.height = canvasRef.current!.height;
      }
      setClearCanvas(false);
    }
  }, [clearCanvas]);

  const handleClearCanvas = () => {
    setClearCanvas(true);
  };

  const resizeCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Preserve drawing after resize
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
    } else if (timeLeft === 0) {
      setIsDrawingComplete(true);
      setIsPlaying(false);
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
    if (contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );
    }
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
      setIsDrawingComplete(false);
      setCurrentPlayer(2);
    } else {
      setPlayer2Score((prevPlayer2Score) => prevPlayer2Score + rating);
      setIsDrawingComplete(false);
      setCurrentPlayer(1);
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="px-6 py-4">
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
            Start Game
          </button>
        </div>

        <div className="border-2 border-pink-500 p-10 rounded-lg shadow-md">
          <div className="text-start text-xl font-bold my-4 text-gray-300">
            Draw: {isPlaying && currentPrompt}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-gray-300">
              Time: {timeLeft}s
            </div>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    currentColor === color.value
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  aria-label={`Select ${color.name} color`}
                  title={color.name}
                />
              ))}
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
            className="border border-pink-500 rounded-md cursor-crosshair w-auto h-80 touch-none"
          />
        </div>
        <button
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-5 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-700 disabled:text-gray-900 disabled:cursor-not-allowed"
          onClick={handleClearCanvas}
          disabled={isPlaying || isDrawing}
        >
          Clear Canvas
        </button>

        <div className="mb-4 border-2 border-pink-500 rounded-lg p-6 shadow-md mt-4">
          {isDrawingComplete && (
            <div className="text-center space-y-2 mt-4">
              <p className="text-lg text-white">
                Rate Player {currentPlayer}'s drawing:
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => rateDrawing(rating)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isDrawingComplete && <hr className="mt-5 mb-5 border-gray-500" />}

          <div className="flex gap-5 justify-center text-xl font-semibold text-white">
            <p>Player 1 score: {player1Score}</p>
            <p>Player 2 score: {player2Score}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
