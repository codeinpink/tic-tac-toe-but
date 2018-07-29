const blankBoard = [
  '', '', '',
  '', '', '',
  '', '', ''
];

export class Board {
  constructor({boardId, cells = blankBoard, turn = '', timeLimitMs = 0}) {
    this.boardId = boardId
    this.cells = cells
    this.key = `${boardId}:${cells.join('')}`
    this.turn = turn
    this.timeLimitMs = timeLimitMs
  }

  placePiece(r, c, piece) {
    const pieceIndex = r * 3 + c;
    const newCells = this.cells.map((val, i) => {
      return i === pieceIndex ? piece : val;
    });
    return new Board({
      boardId: this.boardId,
      cells: newCells,
      turn: this.turn,
      timeLimitMs: this.timeLimitMs
    });
  }

  changeTurn(piece, timeLimitMs) {
    return new Board({
      boardId: this.boardId,
      cells: this.cells,
      turn: piece,
      timeLimitMs: timeLimitMs
    });
  }
}
