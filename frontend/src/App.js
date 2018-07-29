import React, { Component } from 'react';
import { DebugEvents, Score, Boards } from './components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div>
          <Score />
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
