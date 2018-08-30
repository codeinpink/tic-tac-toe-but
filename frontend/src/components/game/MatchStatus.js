import React from 'react'
import PropTypes from 'prop-types'
import './MatchStatus.css'
import { connect } from 'react-redux'

const Component = ({curScore, playerPiece, bannerMsg}) => {
  return (
    <div>
      <h2>{bannerMsg}</h2>
      <h2>Score</h2>
      <div className="scores">
        <span><strong>X:</strong> {curScore.x}</span>
        <span><strong>O:</strong> {curScore.o}</span>
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
  curScore: state.game.score,
  playerPiece: state.game.playerPiece,
  bannerMsg: state.game.bannerMsg
})

export const MatchStatus = connect(
  mapStateToProps
)(Component)
