import React, { Component } from 'react';
import { DebugEvents, Score, Boards } from './components';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Score />
        <Boards />
        <DebugEvents />
      </div>
    );
  }
}

export default App;
