import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

export default class TableCircularLoading extends Component {
  render () {
    return (
      this.props.loading
        ? <div className='-loading -active'>
            <div className='-loading-inner'>
              <CircularProgress />
            </div>
          </div>
        : null
    )
  }
}