import { combineReducers } from 'redux';

const score = (state = 0, action) => {
  switch (action.type) {
    case 'SCORE_CHANGED':
      return state + action.score;
    default:
      return state
  }
};

export const rootReducer = combineReducers({
  score
});
