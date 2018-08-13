import React from 'react'
import { Link } from 'react-router-dom'

export function Landing () {
  return <div>
    <h1>Tic Tac Toe But</h1>
    <Link to="/game">Start game</Link>
  </div>
}
