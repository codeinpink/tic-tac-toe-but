import React from 'react'
import './Board.css';
import { groupBy } from '../groupby';

export function Board(props) {
  const grid = groupBy(props.cells, (piece, i) => i / 3 | 0);
  const rowElems = (r, row) => row.map((piece, c) => (
    <span className='cell'
      key={c}
      onClick={() => {
        if (props.canPlay) {
          props.cellClicked(r, c);
        }
      }}
    >{piece || ' '}</span>
  ));

  return <div className={`board ${props.canPlay ? 'playable' : 'not-playable'}`}>
    {grid.map((row, r) => (
      <div key={r} className='row'>
        {rowElems(r, row)}
      </div>
    ))}
  </div>
}
