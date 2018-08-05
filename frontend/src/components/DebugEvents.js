import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { scoreChanged, gameStarted, boardStarted, piecePlaced, boardEnded, gameEnded, boardTurnChanged } from '../actions'

class Component extends React.Component {
  constructor (props) {
    super(props)
    const {dispatch} = props
    this.dispatch = dispatch
    this.state = {
      xScore: 0,
      oScore: 0,
      boardId: 0,
      r: 0,
      c: 0,
      piece: 'x',
      timeMs: 1000
    }
  }

  render () {
    return (<div>
      <h2>Events</h2>

      <div>
        <button onClick={() => {
          this.dispatch(gameStarted({playerPiece: 'x'}))
        }}>New game (x)</button>
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(boardStarted({
            boardId: this.state.boardId
          }))
        }}>New board</button>
        <input
          type="number"
          placeholder="boardId"
          value={this.state.boardId}
          onChange={e => this.setState({boardId: Number(e.target.value)})}
        />
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(scoreChanged({x: this.state.xScore, o: this.state.oScore}))
        }}>Score changed</button>
        <input
          type="number"
          placeholder="x score"
          onChange={e => this.setState({xScore: Number(e.target.value)})}
        />
        <input
          type="number"
          placeholder="o score"
          onChange={e => this.setState({oScore: Number(e.target.value)})}
        />
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(piecePlaced({
            boardId: this.state.boardId,
            cell: {
              r: this.state.r,
              c: this.state.c
            },
            piece: this.state.piece
          }))
        }}>Piece placed</button>
        <input
          type="number"
          placeholder="boardId"
          value={this.state.boardId}
          onChange={e => this.setState({boardId: Number(e.target.value)})}
        />
        <input
          type="number"
          placeholder="r"
          onChange={e => this.setState({r: Number(e.target.value)})}
        />
        <input
          type="number"
          placeholder="c"
          onChange={e => this.setState({c: Number(e.target.value)})}
        />
        <input
          type="text"
          placeholder="piece"
          value={this.state.piece}
          onChange={e => this.setState({piece: e.target.value})}
        />
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(boardTurnChanged({
            boardId: this.state.boardId,
            turn: this.state.piece,
            timeLimitMs: this.state.timeMs
          }))
        }}>Turn changed</button>
        <input
          type="number"
          placeholder="boardId"
          value={this.state.boardId}
          onChange={e => this.setState({boardId: Number(e.target.value)})}
        />
        <input
          type="text"
          placeholder="turn"
          value={this.state.piece}
          onChange={e => this.setState({piece: e.target.value})}
        />
        <input
          type="number"
          placeholder="turn time limit (ms)"
          value={this.state.timeMs}
          onChange={e => this.setState({timeMs: Number(e.target.value)})}
        />
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(boardEnded({
            boardId: this.state.boardId,
            winner: this.state.piece
          }))
        }}>Board ended</button>
        <input
          type="number"
          placeholder="boardId"
          value={this.state.boardId}
          onChange={e => this.setState({boardId: Number(e.target.value)})}
        />
        <input
          type="text"
          placeholder="winner"
          value={this.state.piece}
          onChange={e => this.setState({piece: e.target.value})}
        />
      </div>

      <div>
        <button onClick={() => {
          this.dispatch(gameEnded({
            winner: this.state.piece
          }))
        }}>Game ended</button>
        <input
          type="text"
          placeholder="winner"
          value={this.state.piece}
          onChange={e => this.setState({piece: e.target.value})}
        />
      </div>

    </div>)
  }
}

Component.propTypes = {
  dispatch: PropTypes.func.isRequired
}

export const DebugEvents = connect()(Component)
