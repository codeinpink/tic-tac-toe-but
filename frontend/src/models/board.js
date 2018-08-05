import { none, some } from '../option'

const blankBoard = [
  '', '', '',
  '', '', '',
  '', '', ''
]

export class Board {
  constructor ({boardId, cells = blankBoard, turn = '', winner = none, timeLimitMs = 0}) {
    this.key = boardId
    this.boardId = boardId
    this.cells = cells
    this.turn = turn
    this.winner = winner
    this.timeLimitMs = timeLimitMs
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
      winner: some(winner)
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
