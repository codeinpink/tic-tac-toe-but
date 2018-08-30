import React from 'react'
import { connect } from 'react-redux'
import { Board } from './Board'
import './Boards.css'

const Component = ({boards, cellClicked, playerPiece}) => {
  const boardState = (board) => {
    const won = board.winner.map(winner => {
      if (winner === playerPiece) {
        return 'won'
      } else if (winner === 'tie') {
        return 'tie'
      } else {
        return 'lost'
      }
    })
    if (won.isDefined()) {
      return won.get()
    } else {
      return board.turn === playerPiece ? 'can-play' : 'waiting'
    }
  }
  const boardElems = boards.map(board => (
    <div
      className="board-container"
      key={board.key}
    >
      <Board
        cells={board.cells}
        boardState={boardState(board)}
        cellClicked={(r, c) => cellClicked(board.boardId, r, c)}
        timeLimitMs={board.timeLimitMs}
      ></Board>
    </div>)
  )
  return boardElems
}

const mapStateToProps = (state, ownProps) => ({
  boards: state.game.boards,
  playerPiece: state.game.playerPiece
})

export const Boards = connect(
  mapStateToProps
)(Component)
