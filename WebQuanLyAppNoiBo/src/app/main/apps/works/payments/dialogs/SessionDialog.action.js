import React from 'react';
import { showDialog,hideDialog } from 'app/store/actions';
import SessionDialog from './SessionDialog';

const session_dialog_key = "session-dialog";
export function showSessionDialog({ _id,appointmentId,patientCode,onSuccess }) {
    // console.log("showQuickEditDialog");
    return (dispatch) => {
        const dialog = {
            children: <SessionDialog onSuccess={onSuccess} _id={_id} appointmentId={appointmentId} patientCode={patientCode}/>,
            id: session_dialog_key,
            rootClass: "w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}

export function hideSessionDialog() {
    return(dispatch)=>
        dispatch(hideDialog(session_dialog_key));
}