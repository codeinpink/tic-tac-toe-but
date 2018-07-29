import React from 'react'
import { connect } from 'react-redux'

const Component = ({curScore, onClick}) => {
  return (
    <span>x: { curScore.x }, o: { curScore.o }</span>
  )
}

const mapStateToProps = (state, ownProps) => ({
  curScore: state.score
})

export const Score = connect(
  mapStateToProps
)(Component)
