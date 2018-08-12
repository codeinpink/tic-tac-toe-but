import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Landing, Game } from './components'
import './App.css'

export function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route path="/game" component={Game}/>
        <Redirect to="/"/>
      </Switch>
    </BrowserRouter>
  )
}
