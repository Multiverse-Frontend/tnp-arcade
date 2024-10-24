"use client"

import { useState, useEffect } from 'react'
import "../globals.css";
import { ArrowBackOutline } from 'react-ionicons';
import Link from 'next/link';

const symbols = ['☆', '♠', '♥', '♦', '♣', '♫', '☺', '☼']

interface Card {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

interface ColorScheme {
  name: string
  background: string
  text: string
  card: string
  cardFlipped: string
  button: string
  buttonHover: string
}

const colorSchemes: ColorScheme[] = [
  {
    name: 'Purple',
    background: 'bg-gray-900',
    text: 'text-purple-400',
    card: 'bg-gray-700',
    cardFlipped: 'bg-#c4abc4-400 text-gray-900',
    button: 'bg-purple-400 text-gray-900',
    buttonHover: 'hover:bg-purple-500',
  },
  {
    name: 'Blue',
    background: 'bg-gray-900',
    text: 'text-blue-400',
    card: 'bg-gray-700',
    cardFlipped: 'bg-blue-400 text-gray-900',
    button: 'bg-blue-400 text-gray-900',
    buttonHover: 'hover:bg-blue-500',
  },
  {
    name: 'Green',
    background: 'bg-gray-900',
    text: 'text-green-400',
    card: 'bg-gray-700',
    cardFlipped: 'bg-#c4abc4-400 text-gray-900',
    button: 'bg-green-400 text-gray-900',
    buttonHover: 'hover:bg-green-500',
  },
]

const MemoryGame = () =>{
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [moves, setMoves] = useState(0)
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorSchemes[0])

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const shuffledCards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMatches(0)
    setMoves(0)
  }

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return
    
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    ))
    
    setFlippedCards([...flippedCards, id])
    setMoves(moves + 1)

    if (flippedCards.length === 1) {
      const [firstCardId] = flippedCards
      const firstCard = cards.find(card => card.id === firstCardId)
      const secondCard = cards.find(card => card.id === id)

      if (firstCard?.symbol === secondCard?.symbol) {
        setCards(cards.map(card => 
          card.id === firstCardId || card.id === id ? { ...card, matched: true } : card
        ))
        setMatches(matches + 1)
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstCardId || card.id === id ? { ...card, flipped: false } : card
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleColorSchemeChange = (schemeName: string) => {
    const newScheme = colorSchemes.find(scheme => scheme.name === schemeName)
    if (newScheme) {
      setColorScheme(newScheme)
    }
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${colorScheme.background} ${colorScheme.text} font-mono`}>
      <div className="flex justify-start items-start w-full max-w-4xl mb-4">
      <Link href="/">
        <ArrowBackOutline color={"#ffffff"} height="35px" width="35px" />
      </Link>
    </div>
      <h1 className="text-4xl mb-8 tracking-wide">Memory Game</h1>
      <div className="mb-4">
        <span className="mr-4">Moves: {moves}</span>
        <span>Matches: {matches}</span>
      </div>
      <div className="mb-4">
        <label htmlFor="colorScheme" className="mr-2">Color Scheme:</label>
        <select
          id="colorScheme"
          value={colorScheme.name}
          onChange={(e) => handleColorSchemeChange(e.target.value)}
          className={`${colorScheme.button} rounded px-2 py-1`}
        >
          {colorSchemes.map(scheme => (
            <option key={scheme.name} value={scheme.name}>{scheme.name}</option>
          ))}
        </select>
      </div>
      <div className={`grid grid-cols-4 gap-4 p-4 ${colorScheme.background} border-4 ${colorScheme.text} rounded`}>
        {cards.map(card => (
          <button
            key={card.id}
            className={`w-16 h-16 text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
              card.flipped ? colorScheme.cardFlipped : colorScheme.card
            } ${card.matched ? 'opacity-50 cursor-default' : ''} border-2 ${colorScheme.text} rounded`}
            onClick={() => !card.flipped && !card.matched && handleCardClick(card.id)}
            disabled={card.flipped || card.matched}
          >
            {card.flipped || card.matched ? card.symbol : '?'}
          </button>
        ))}
      </div>
      <button
        className={`mt-8 px-4 py-2 ${colorScheme.button} rounded ${colorScheme.buttonHover} transition-colors`}
        onClick={initializeGame}
      >
        New Game
      </button>
    </div>
  )
}
export default MemoryGame;
