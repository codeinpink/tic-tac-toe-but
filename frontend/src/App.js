import React from 'react'
import PropTypes from 'prop-types'
import { DebugEvents, MatchStatus, Boards } from './components'
import './App.css'

export function App ({cellClicked}) {
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

App.propTypes = {
  cellClicked: PropTypes.func.isRequired
}
