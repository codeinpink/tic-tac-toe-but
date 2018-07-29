import React, { Component } from 'react';
import { Score } from './containers';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Tick Tack Toe But</h1>
        </header>
        <Score />
      </div>
    );
  }
}

export default App;
