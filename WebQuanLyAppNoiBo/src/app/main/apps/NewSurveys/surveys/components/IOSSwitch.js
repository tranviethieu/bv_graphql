import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import * as BaseConfig from '../BaseConfig/BaseConfig'


const useStyles = makeStyles(theme => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                // backgroundColor: '#52d869',
                backgroundColor: `${BaseConfig.BaseColor}`,
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            // color: '#52d869',
            color: `${BaseConfig.BaseColor}`,
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        // backgroundColor: theme.palette.grey[50],
        backgroundColor: "#8c918d",
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}));
function IOSSwitch(props) {
    const classes = useStyles();
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    )
}
export default IOSSwitch;