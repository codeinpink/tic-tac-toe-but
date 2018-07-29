import React from 'react'
import { connect } from 'react-redux'

const Component = ({curScore, playerPiece, bannerMsg}) => {
  return (
    <div>
      <h2>{bannerMsg}</h2>
      <h3>Score x: {curScore.x} o: {curScore.o}</h3>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  curScore: state.score,
  playerPiece: state.playerPiece,
  bannerMsg: state.bannerMsg
})

export const MatchStatus = connect(
  mapStateToProps
)(Component)
