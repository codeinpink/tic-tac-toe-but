import React from 'react'
import PropTypes from 'prop-types'
import './TimeBar.css'

export function TimeBar (props) {
  return <div
    style={{width: `${props.ratio * 100}%`}} className='timer'>
  </div>
}

TimeBar.propTypes = {
  ratio: PropTypes.number.isRequired
}
