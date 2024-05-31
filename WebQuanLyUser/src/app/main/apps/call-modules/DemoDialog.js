import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';

import Iframe from 'react-iframe'

function DemoDialog(props) {
    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            open={props.open}
            onClose={props.onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogContent classes={{ root: "p-24" }}>
            <Iframe url={props.url}
                        width="100%"
                        height="600px"
                        id="myId"
                        className="myClassname"
                        // display="initial"
                        position="relative" />
            </DialogContent>
        </Dialog>
    )
}
export default DemoDialog;
