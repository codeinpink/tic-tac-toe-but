import React from 'react'
import PropTypes from 'prop-types'
import './MatchStatus.css'
import { connect } from 'react-redux'

const Component = ({curScore, playerPiece, bannerMsg}) => {
  return (
    <div>
      <h2>{bannerMsg}</h2>
      <h2>Score</h2>
      <div class="scores">
        <span>X: <strong>{curScore.x}</strong></span>
        <span>O: <strong>{curScore.o}</strong></span>
      </div>
    </div>
  )
}

Component.propTypes = {
  curScore: PropTypes.shape({
    x: PropTypes.number.isRequired,
    o: PropTypes.number.isRequired
  }).isRequired,
  playerPiece: PropTypes.string.isRequired,
  bannerMsg: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  curScore: state.score,
  playerPiece: state.playerPiece,
  bannerMsg: state.bannerMsg
})

export const MatchStatus = connect(
  mapStateToProps
)(Component)
