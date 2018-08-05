import option from 'scala-like-option'

const blankBoard = [
  '', '', '',
  '', '', '',
  '', '', ''
]

export class Board {
  constructor ({boardId, cells = blankBoard, turn = '', winner = option.None(), timeLimitMs = 0}) {
    this.boardId = boardId
    this.cells = cells
    this.turn = turn
    this.winner = winner
    this.timeLimitMs = timeLimitMs
    this.key = `${boardId}:${cells.join('')}:${turn}:${winner.getOrElse('none')}:${timeLimitMs}`
  }

  data () {
    return {
      boardId: this.boardId,
      cells: this.cells,
      turn: this.turn,
      winner: this.winner,
      timeLimitMs: this.timeLimitMs
    }
  }

  changeWinner (winner) {
    return new Board({
      ...this.data(),
      winner: option.Some(winner)
    })
  }

  placePiece (r, c, piece) {
    const pieceIndex = r * 3 + c
    const newCells = this.cells.map((val, i) => {
      return i === pieceIndex ? piece : val
    })
    return new Board({
      ...this.data(),
      cells: newCells
    })
  }

  changeTurn (piece, timeLimitMs) {
    return new Board({
      ...this.data(),
      turn: piece,
      timeLimitMs: timeLimitMs
    })
  }
}
