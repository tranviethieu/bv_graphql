import React from 'react';
import { showDialog } from 'app/store/actions';
import QuickTableDialog from '../quick-table-dialog/QuickTableDialog';
import QuickTableFetchDataDialog from '../quick-table-dialog/QuickTableFetchDataDialog';

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
export function showQuickTableFetchDataDialog({ rootClass, ...props }) {
    return (dispatch) => {
        const dialog = {
            children: <QuickTableFetchDataDialog {...props} />,
            id: 'quick-table-dialog',
            rootClass
        };
        dispatch(showDialog(dialog))
    }
}