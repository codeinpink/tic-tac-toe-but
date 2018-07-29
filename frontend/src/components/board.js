import React from 'react'

export function Board(props) {
  return props.cells.map((piece, i) => (
    <span
      key={i}
      onClick={e => {
        const r = i / 3 | 0,
          c = i % 3;
        props.cellClicked(r, c);
      }}
    >
      {piece},
    </span>
  ))
}
