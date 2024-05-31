import React, { Component } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '80%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TableProgressBarLoading(props) {
        return (
            props.loading
                ? <div className='-loading -active'>
                    <div className='-loading-inner'>
                        <LinearProgress color="primary"/>
                    </div>
                </div>
                : null
        )
}