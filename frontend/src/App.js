import React, { Component } from 'react';
import { DebugEvents, MatchStatus, Boards } from './components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div>
          <MatchStatus />
        </div>
        <Boards />
        <div>
          <DebugEvents />
        </div>
      </div>
    );
  }
}

export default App;
