import React from 'react';
import { DebugEvents, MatchStatus, Boards } from './components';
import './App.css';

export function App({cellClicked}) {
  return (
    <div className="app">
      <div>
        <MatchStatus />
      </div>
      <Boards cellClicked={cellClicked} />
      <div>
        <DebugEvents />
      </div>
    </div>
  )
}
