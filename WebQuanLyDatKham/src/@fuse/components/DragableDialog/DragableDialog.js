import React from 'react';
import clsx from 'clsx';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { makeStyles } from '@material-ui/core/styles';

function PaperComponent(props) {
    return (
        <Draggable handle={['.MuiCardHeader-root','.MuiCardActions-root', '.div-footer']}
          cancel={'[class*="MuiDialogContent-root"]'} className = "el-Draggable-Cover">
            <Paper {...props} />
        </Draggable>
    );
}
const useStyles = makeStyles(theme => ({
    root: {
        zIndex: 999,
        position: "absolute",
        top: 64,
        right:0,
        left: 0,
        margin:"auto"
    },
}));

function DragableDialog({children,rootClass}) {
    const classes = useStyles();
    return (
        <PaperComponent className={clsx(classes.root,rootClass, "el-Draggable-Dialog")}>
            {children}
        </PaperComponent>
    )
}
export default DragableDialog;
