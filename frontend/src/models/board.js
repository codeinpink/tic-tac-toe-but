const blankBoard = [
  '', '', '',
  '', '', '',
  '', '', ''
];

export class Board {
  constructor(boardId, cells = blankBoard) {
    this.boardId = boardId;
    this.cells = cells;
    this.key = `${boardId}:${cells.join('')}`;
  }

  placePiece(r, c, piece) {
    const pieceIndex = r * 3 + c;
    const newCells = this.cells.map((val, i) => {
      return i === pieceIndex ? piece : val;
    });
    return new Board(this.boardId, newCells);
  }
}
