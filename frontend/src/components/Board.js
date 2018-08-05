import React from 'react'
import PropTypes from 'prop-types'
import './Board.css'
import { groupBy } from '../groupby'

export function Board (props) {
  const grid = groupBy(props.cells, (piece, i) => i / 3 | 0)
  const rowElems = (r, row) => row.map((piece, c) => (
    <span className={`cell row-${r} col-${c}`}
      key={c}
      onClick={() => {
        props.cellClicked(r, c)
      }}
    >{piece || ' '}</span>
  ))

  return <div className={`board ${props.boardState}`}>
    {grid.map((row, r) => (
      <div key={r} className='row'>
        {rowElems(r, row)}
      </div>
    ))}
  </div>
}

Board.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.string).isRequired,
  boardState: PropTypes.oneOf(['won', 'lost', 'can-play', 'waiting']).isRequired,
  cellClicked: PropTypes.func.isRequired
}
