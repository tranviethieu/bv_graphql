import React from 'react';
import { showDialog } from 'app/store/actions';
import QuickTableDialog from '../quick-table-dialog/QuickTableDialog';
export function showQuickTableDialog({ rootClass, ...props }) {
    return (dispatch) => {
        const dialog = {
            children: <QuickTableDialog {...props} />,
            id: 'quick-table-dialog',
            rootClass
        };
        dispatch(showDialog(dialog))
    }
}