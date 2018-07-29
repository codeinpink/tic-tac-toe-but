import React from 'react'
import { connect } from 'react-redux'
import { cellClicked } from '../actions';
import { Board } from './board';

const Component = ({boards, cellClicked}) => {
  const boardElems = boards.map(board => (
    <Board
      key={board.key}
      cells={board.cells}
      cellClicked={(r, c) => {
        cellClicked(board.boardId, r, c);
      }}
    ></Board>)
  );
  return boardElems;
}

const mapStateToProps = (state, ownProps) => ({
  boards: state.boards
})

const mapDispatchToProps = dispatch => ({
  cellClicked: (boardId, r, c) =>
    dispatch(cellClicked(boardId, {r, c}))
})

export const Boards = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
