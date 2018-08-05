import React from 'react'
import PropTypes from 'prop-types'
import option from 'scala-like-option'

import './Board.css'
import { groupBy } from '../groupby'
import { TimeBar } from './TimeBar'

const timerRefreshMs = 20

function timeMs () {
  return (new Date()).getTime()
}

export class Board extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.timerId = option.None()
    this.state = {
      turnElapsedRatio: 0,
      timerVisible: false
    }
  }

  render () {
    const grid = groupBy(this.props.cells, (piece, i) => i / 3 | 0)
    const rowElems = (r, row) => row.map((piece, c) => (
      <span className='cell'
        key={c}
        onClick={() => {
          this.props.cellClicked(r, c)
        }}
      >{piece || ' '}</span>
    ))
    return (<div className={`board ${this.props.boardState}`}>
      {this.state.timerVisible && <TimeBar ratio={this.state.turnElapsedRatio} />}
      {grid.map((row, r) => (
        <div key={r} className='row'>
          {rowElems(r, row)}
        </div>
      ))}
    </div>)
  }

  clearTimer () {
    this.timerId.forEach(id => clearInterval(id))
    this.timerId = option.None()
    this.setState({
      timerVisible: false
    })
  }

  startTimer () {
    this.clearTimer()
    const endTime = timeMs() + this.props.timeLimitMs
    this.timerId = option.Some(setInterval(() => {
      const ratio = 1 - ((endTime - timeMs()) / this.props.timeLimitMs)
      if (ratio >= 1) {
        this.clearTimer()
      } else {
        this.setState({
          turnElapsedRatio: ratio
        })
      }
    }, timerRefreshMs))
    this.setState({
      timerVisible: true
    })
  }

  componentDidUpdate (oldProps) {
    if (oldProps.boardState !== this.props.boardState) {
      if (this.props.boardState === 'can-play') {
        this.startTimer()
      } else {
        this.clearTimer()
      }
    }
  }
}

Board.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.string).isRequired,
  boardState: PropTypes.oneOf(['won', 'lost', 'can-play', 'waiting']).isRequired,
  cellClicked: PropTypes.func.isRequired,
  timeLimitMs: PropTypes.number.isRequired
}
