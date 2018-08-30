import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Landing, Game } from './components'
import { createStore } from 'redux'
import { rootReducer } from './components/game/reducers'
import './App.css'

export function App () {
  const basename = process.env.REACT_APP_BASE_URL
  const store = createStore(rootReducer)

  return (
    <Provider store={store}>
      <BrowserRouter basename={basename}>
        <Switch>
          <Route exact path="/" component={Landing}/>
          <Route path="/game" component={Game}/>
          <Redirect to="/"/>
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}
