import React from 'react';
import { showDialog,hideDialog } from 'app/store/actions';
import IndicationDialog from './IndicationDialog';
import IndicationTransactionDialog from './IndicationTransactionDialog'

const indication_dialog_key = "indication-dialog";
export function showIndicationDialog({ _id,code,onSuccess }) {
    return (dispatch) => {
        const dialog = {
            children: <IndicationDialog onSuccess={onSuccess} _id={_id} code={code}/>,
            id: indication_dialog_key,
            rootClass: "md:w-1/2 sm:w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function showIndicationTransactionDialog({ data ,onSuccess }) {
    return (dispatch) => {
        const dialog = {
            children: <IndicationTransactionDialog onSuccess={onSuccess} data = {data}/>,
            id: "indication_transaction_dialog",
            rootClass: "md:w-1/2 sm:w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function hideIndicationTransactionDialog() {
    return(dispatch)=>
        dispatch(hideDialog("indication_transaction_dialog"));
}
export function hideIndicationDialog() {
    return(dispatch)=>
        dispatch(hideDialog(indication_dialog_key));
}
