import React from "react";

interface AppProps {
  modalType: "rate" | "endGame";
  setShowModal: (value: boolean) => void;
  currentPlayer: number;
  rateDrawing: (rating: number) => void;
  player1Score: number;
  player2Score: number;
  resetGame: () => void;
}

const Modal: React.FC<AppProps> = ({
  modalType,
  setShowModal,
  currentPlayer,
  rateDrawing,
  player1Score,
  player2Score,
  resetGame,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-[#2a0e20] p-8 rounded-lg max-w-md w-full">
        <div className="flex items-end justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-300 hover:text-white"
          >
            &#x2715;
          </button>
        </div>
        <h2 className="text-2xl text-center font-bold text-pink-500 mb-6">
          {modalType === "rate" ? "Rate the Drawing" : "Game Over"}
        </h2>

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
  );
};

export default Modal;
