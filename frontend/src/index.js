import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { App } from './App'
import { rootReducer } from './reducers'
import { WSClient } from './wsclient'
import { msgToAction } from './msg-to-action'
import './index.css'

const store = createStore(rootReducer)
const wsClient = new WSClient(
  'ws://localhost:3000/socket',
  (msg) => {
    let json
    try {
      json = JSON.parse(msg)
    } catch (e) {
      console.warn('Invalid message', msg)
      return
    }
    const action = msgToAction(json)
    if (action !== null) {
      store.dispatch(action)
    } else {
      console.warn('Unknown message', msg)
    }
  }
)

const cellClicked = (boardId, row, col) => {
  wsClient.send({
    'cell-clicked': {
      'board-id': boardId,
      'cell': {
        r: row,
        c: col
      }
    }
  })
}

ReactDOM.render(
  <Provider store={store}>
    <App cellClicked={cellClicked}/>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
