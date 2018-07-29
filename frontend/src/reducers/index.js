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

const inProgress = (state = false, action) => {
  switch (action.type) {
    case 'GAME_STARTED':
      return true
    case 'GAME_ENDED':
      return false
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
  inProgress,
  boards
});
