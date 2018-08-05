export const gameStarted = ({playerPiece}) => ({
  type: 'GAME_STARTED',
  playerPiece
})

export const gameEnded = ({winner}) => ({
  type: 'GAME_ENDED',
  winner
})

export const scoreChanged = ({x, o}) => ({
  type: 'SCORE_CHANGED',
  x,
  o
})

export const boardStarted = ({boardId}) => ({
  type: 'BOARD_STARTED',
  boardId
})

export const boardEnded = ({boardId, winner}) => ({
  type: 'BOARD_ENDED',
  boardId,
  winner
})

export const piecePlaced = ({boardId, cell, piece}) => ({
  type: 'PIECE_PLACED',
  boardId,
  cell,
  piece
})

export const boardTurnChanged = ({boardId, turn, timeLimitMs}) => ({
  type: 'BOARD_TURN_CHANGED',
  boardId,
  turn,
  timeLimitMs
})
