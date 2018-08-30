import { combineReducers } from 'redux'
import { reducer as gameReducer } from './components/game'

export const reducer = combineReducers({
  game: gameReducer
})
