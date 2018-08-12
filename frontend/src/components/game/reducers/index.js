import { combineReducers } from 'redux'
import { Board } from '../models'

const maxBoards = 16
const score = (state = {x: 0, o: 0}, action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return {
        x: 0,
        o: 0
      }
    case 'SCORE_CHANGED':
      return {
        x: action.x,
        o: action.o
      }
    default:
      return state
  }
}

const playerPiece = (state = '', action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return action.playerPiece
    default:
      return state
  }
}

const bannerMsg = (state = 'Waiting for opponent...', action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return `Game started! You are ${action.playerPiece}!`
    case 'GAME_ENDED':
      return `Game over! ${action.winner === 'tie' ? 'Tie game!' : `Winner is ${action.winner}!`}`
    default:
      return state
  }
}

const boards = (state = [], action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return []
    case 'BOARD_STARTED':
      const newBoard = new Board({boardId: action.boardId})
      if (state.length < maxBoards) {
        return [...state, newBoard]
      } else {
        const replaceIndex = state.findIndex(board => board.winner.isDefined())
        return state.map((board, i) => {
          return i === replaceIndex ? newBoard : board
        })
      }
    case 'BOARD_ENDED':
      return state.map(board => {
        return board.boardId === action.boardId
          ? board.changeWinner(action.winner)
          : board
      })
    case 'BOARD_TURN_CHANGED':
      return state.map(board => {
        return board.boardId === action.boardId
          ? board.changeTurn(action.turn, action.timeLimitMs)
          : board
      })
    case 'PIECE_PLACED':
      return state.map(board => {
        return board.boardId === action.boardId
          ? board.placePiece(action.cell.r, action.cell.c, action.piece)
          : board
      })
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  score,
  bannerMsg,
  boards,
  playerPiece
})
