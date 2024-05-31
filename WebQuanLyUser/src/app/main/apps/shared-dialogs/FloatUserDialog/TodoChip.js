import React from 'react';
import {makeStyles} from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root : {
        display        : 'flex',
        alignItems     : 'center',
        height         : 21,
        borderRadius   : 2,
        padding: '0 6px',
        marginBottom: 5,
        fontSize       : 13,

    },

}));

function TodoChip(props)
{
    const classes = useStyles();
    return (
        <div className={clsx(classes.root, props.className)} style={{backgroundColor: props.color}} id = "el-TodoChipDrag">
          <div id = "el-TodoChipDragTittle">{props.title}</div>
        </div>
    );
}

export default TodoChip;
