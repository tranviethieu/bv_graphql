import React from 'react';
import { showDialog } from 'app/store/actions';
import ImportExcelDialog from '../import-excel-table/ImportExcelDialog';
export function showImportExcelDialog({ rootClass, ...props }) {
    return (dispatch) => {
        const dialog = {
            children: <ImportExcelDialog {...props} />,
            id: 'quick-table-dialog',
            rootClass
        };
        dispatch(showDialog(dialog))
    }
}