import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Landing, Game } from './components'
import './App.css'

const basename = process.env.REACT_APP_BASE_URL

export function App () {
  return (
    <BrowserRouter basename={basename}>
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route path="/game" component={Game}/>
        <Redirect to="/"/>
      </Switch>
    </BrowserRouter>
  )
}
