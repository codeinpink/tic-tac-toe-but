import * as actions from './actions'

export function msgToAction (msg) {
  const msgId = Object.keys(msg)[0]
  const body = msg[msgId]
  switch (msgId) {
    case 'game-started':
      return actions.gameStarted({
        playerPiece: body['player-piece']
      })
    case 'game-ended':
      return actions.gameEnded({
        winner: body['winner']
      })
    case 'board-started':
      return actions.boardStarted({
        boardId: body['board-id']
      })
    case 'board-turn-changed':
      return actions.boardTurnChanged({
        boardId: body['board-id'],
        turn: body['turn'],
        timeLimitMs: body['time-limit-ms']
      })
    case 'piece-placed':
      return actions.piecePlaced({
        boardId: body['board-id'],
        cell: body['cell'],
        piece: body['piece']
      })
    case 'board-ended':
      return actions.boardEnded({
        boardId: body['board-id'],
        winner: body['winner']
      })
    case 'score-changed':
      return actions.scoreChanged({
        x: body['X'],
        o: body['O']
      })
    default:
      return null
  }
}
