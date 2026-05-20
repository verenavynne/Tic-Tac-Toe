import { useState } from 'react'
import './App.css'
import Player from './components/Player'
import GameBoard from './components/GameBoard'
import Log from './components/Log'
import GameOver from './components/GameOver'
import { WINNING_COMBINATIONS } from './winning_combinations'

const PLAYERS = {
  X :'Player 1',
  O: 'Player 2'
}

const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for (const turn of gameTurns) {
      const {square, player} = turn
      const {row, col} = square

      gameBoard[row][col] = player
  }

  return gameBoard
}

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X'
    if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
      currentPlayer = 'O'
    }

    return currentPlayer
}

function deriveWinner(gameBoard, player){
  let winner = null;
  
  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].col]
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].col]
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].col]
    
    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = player[firstSquareSymbol]
    }
  }
  return winner
}


function App() {
  const [player, setPlayer] = useState(PLAYERS)

  const [gameTurns, setGameTurns] = useState([])
  
  let activePlayer = deriveActivePlayer(gameTurns)

  const gameBoard = deriveGameBoard(gameTurns)
  const winner = deriveWinner(gameBoard, player)
  const hasDraw = !winner && gameTurns.length === 9
  
  function handleSelectSquare(rowIndex, colIndex){
    setGameTurns((prevTurns) => {

      const currentPlayer = deriveActivePlayer(prevTurns)
      const updatedTurns = [
        {square: {row: rowIndex, col: colIndex}, player: currentPlayer},
        ...prevTurns,
      ];

      return updatedTurns
    })
  }

  function handleRestart(){
    setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayer(prevPlayer => {
      return {
        ...prevPlayer,
        [symbol] : newName
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className='highlight-player'>
          <Player 
            initialName={PLAYERS.X}
            symbol="X" 
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player 
            initialName={PLAYERS.O}
            symbol="O" 
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard}/>
      </div>
      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
