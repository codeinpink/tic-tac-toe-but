import React from 'react'
import { connect } from 'react-redux'
import { cellClicked } from '../actions';
import { Board } from './Board';
import './Boards.css'

const Component = ({boards, cellClicked}) => {
  const boardElems = boards.map(board => (
    <div
      className="board-container"
      key={board.key}
    >
      <Board
        cells={board.cells}
        cellClicked={(r, c) => cellClicked(board.boardId, r, c)}
      ></Board>
    </div>)
  );
  return boardElems;
}

const mapStateToProps = (state, ownProps) => ({
  boards: state.boards
})

const mapDispatchToProps = dispatch => ({
  cellClicked: (boardId, r, c) =>
    dispatch(cellClicked({boardId, cell: {r, c}}))
})

export const Boards = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
