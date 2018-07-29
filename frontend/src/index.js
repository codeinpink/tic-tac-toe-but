import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { App } from './App';
import { rootReducer } from './reducers'
import { WSClient } from './wsclient';
import './index.css';

const store = createStore(rootReducer)
const wsClient = new WSClient(
  'ws://localhost:3000/',
  (msg) => {
    console.log('msg', msg)
  }
)

const cellClicked = (boardId, row, col) => {
  console.log('got click', boardId, row, col)
  wsClient.send({
    'cell-clicked': {
      'board-id': boardId,
      'cell': {
        r: row,
        c: col
      }
    }
  });
}

ReactDOM.render(
  <Provider store={store}>
    <App cellClicked={cellClicked}/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
