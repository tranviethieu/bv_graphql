import React from 'react';
import { showDialog } from 'app/store/actions';
import QuickEditDialog from '../quick-edit-dialog/QuickEditDialog';
export function showQuickEditDialog({ rootClass, ...props }) {
    // console.log("showQuickEditDialog");
    return (dispatch) => {
        const dialog = {
            children: <QuickEditDialog {...props} />,
            id: 'quick-edit-dialog',
            rootClass
        };
        dispatch(showDialog(dialog))
    }
}