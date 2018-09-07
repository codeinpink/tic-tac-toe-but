import { combineReducers } from 'redux'
import { boards } from './boards'

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

export const reducer = combineReducers({
  score,
  bannerMsg,
  boards,
  playerPiece
})
