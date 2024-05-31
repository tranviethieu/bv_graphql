import React,{useState} from 'react';
import { showDialog } from 'app/store/actions';
import ConfirmDialog from '@fuse/components/Confirm/ConfirmDialog';

import * as Actions from '../actions';

export function showConfirmDialog({ title, message, onSubmit, count }) {
    
    return (dispatch) => {
        const dialog = {
            children: <ConfirmDialog title={title} open={true} onClose={() => dispatch(Actions.hideDialog('confirm-dialog'))} message={message} onSubmit={() => { onSubmit&&onSubmit();dispatch(Actions.hideDialog('confirm-dialog'))}} count={count} />,
            id: 'confirm-dialog',
            rootClass:'sm:w-full md:w-sm'
        };
        dispatch(showDialog(dialog))
    }
}