const selectLocalState = (state) => state.game

export const boardsSelector = (state) =>
  selectLocalState(state).boards

export const playerPieceSelector = (state) =>
  selectLocalState(state).playerPiece

export const scoreSelector = (state) =>
  selectLocalState(state).score

export const bannerSelector = (state) =>
  selectLocalState(state).bannerMsg
