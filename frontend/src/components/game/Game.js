import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DebugEvents } from './DebugEvents'
import { MatchStatus } from './MatchStatus'
import { Boards } from './Boards'
import { msgToAction } from './msg-to-action'
import { WSClient } from './wsclient'

const wsURL = process.env.REACT_APP_WS_SERVER

class GamePresentation extends React.Component {
  constructor (props) {
    super(props)
    this.wsClient = null
    this.showDebugEvents = props.location.search.includes('debug')
    this.cellClicked = this.cellClicked.bind(this)
    this.dispatch = props.dispatch
  }

  componentDidMount () {
    this.wsClient = new WSClient(
      wsURL,
      (msg) => {
        let json
        try {
          json = JSON.parse(msg)
        } catch (e) {
          return
        }
        const action = msgToAction(json)
        if (action !== null) {
          this.dispatch(action)
        } else {
          console.warn('Unknown message', msg)
        }
      }
    )
  }

  cellClicked (boardId, row, col) {
    this.wsClient.send({
      'cell-clicked': {
        'board-id': boardId,
        'cell': {
          r: row,
          c: col
        }
      }
    })
  }

  render () {
    return (<div className="app">
      <div>
        <MatchStatus />
      </div>
      <Boards cellClicked={this.cellClicked} />
      {this.showDebugEvents && <DebugEvents />}
    </div>)
  }

  componentWillUnmount () {
    this.wsClient.disconnect()
  }
}

GamePresentation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
}

export const Game = connect()(GamePresentation)
