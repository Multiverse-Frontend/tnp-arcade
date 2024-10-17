"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "../components/Modal";
import { drawingPrompts, timeLimitOptions } from "./data";

export default function QuickDrawPlay() {
  //states
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
          {isPlaying && (
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
          )}
        </div>

        <div className="mt-4 flex justify-center gap-5 text-xl font-semibold text-white">
          <p>Player 1 score: {player1Score}</p>
          <p>Player 2 score: {player2Score}</p>
        </div>
      </div>

      {showModal && (
        <Modal
          modalType={modalType}
          setShowModal={setShowModal}
          currentPlayer={currentPlayer}
          rateDrawing={rateDrawing}
          player1Score={player1Score}
          player2Score={player2Score}
          resetGame={resetGame}
        />
      )}
    </div>
  );
}
