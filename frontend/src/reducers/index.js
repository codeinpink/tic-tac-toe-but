import { combineReducers } from 'redux';
import { Board } from '../models';

const score = (state = {x: 0, o: 0}, action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return {
        x: 0,
        o: 0,
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

const bannerMsg = (state = "Waiting for game to start", action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return `Game started! You are ${action.playerPiece}!`
    case 'GAME_ENDED':
      return 'Game over!'
    default:
      return state
  }
}

const boards = (state = [], action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return []
    case 'BOARD_STARTED':
      return [...state, new Board(action.boardId)]
    case 'BOARD_ENDED':
      const endedId = action.boardId;
      return state.filter(board => board.boardId !== endedId)
    case 'PIECE_PLACED':
      return state.map(board => {
        return board.boardId === action.boardId ?
          board.placePiece(action.cell.r, action.cell.c, action.piece) :
          board
      });
    default:
      return state
  }
}

export const rootReducer = combineReducers({
  score,
  bannerMsg,
  boards,
  playerPiece
});
