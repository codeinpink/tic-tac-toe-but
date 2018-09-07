import { Board } from '../models'

const maxBoards = 16

export const boards = (state = [], action) => {
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
