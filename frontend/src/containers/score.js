import React from 'react'
import { connect } from 'react-redux'
import { scoreChanged } from '../actions'

const ScoreComponent = ({curScore, onClick}) => {
  return (
    <div>
      <span>score is { curScore }</span>
      <button onClick={e => {
        e.preventDefault()
        onClick()
      }}>Add</button>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  curScore: state.score
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => dispatch(scoreChanged(1))
})

export const Score = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreComponent)
