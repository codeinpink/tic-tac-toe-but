import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { rootReducer } from './reducers'
import { DebugEvents } from './DebugEvents'
import { MatchStatus } from './MatchStatus'
import { Boards } from './Boards'
import { msgToAction } from './msg-to-action'
import { WSClient } from './wsclient'

const wsURL = process.env.REACT_APP_WS_SERVER

export class Game extends React.Component {
  constructor (props) {
    super(props)
    this.store = createStore(rootReducer)
    this.wsClient = null
    this.showDebugEvents = props.location.search.includes('debug')
    this.cellClicked = this.cellClicked.bind(this)
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
          this.store.dispatch(action)
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
    return <Provider store={this.store}>
      <div className="app">
        <div>
          <MatchStatus />
        </div>
        <Boards cellClicked={this.cellClicked} />
        {this.showDebugEvents && <DebugEvents />}
      </div>
    </Provider>
  }

  componentWillUnmount () {
    this.wsClient.disconnect()
  }
}

Game.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
}
