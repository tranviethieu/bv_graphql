import React from 'react';
import { showDialog,hideDialog } from 'app/store/actions';
import AppointmentDialog from '../appointment/AppointmentDialog';
import ChangeStateDialog from '../appointment/ChangeStateAppointmentDialog';
import InfoDialog from '../appointment/InfoDialog'

const appointment_dialog_key = "appointment-dialog";
export function showAppointmentDialog({ phoneNumber,_id,patientCode,onSuccess }) {
    // console.log("showQuickEditDialog");
    return (dispatch) => {
        const dialog = {
            children: <AppointmentDialog onSuccess={onSuccess} phoneNumber={phoneNumber} _id={_id} patientCode={patientCode}/>,
            id: appointment_dialog_key,
            rootClass: "w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function showAppointmentStateDialog({ data ,onSuccess}) {
    return (dispatch) => {
        const dialog = {
            children: <ChangeStateDialog data={data} onSuccess={onSuccess}/>,
            id: appointment_dialog_key,
            rootClass: "md:w-1/2 sm:w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function showInfoDialog({ data ,onSuccess, options}) {
    return (dispatch) => {
        const dialog = {
            children: <InfoDialog data={data} onSuccess={onSuccess} options = {options}/>,
            id: appointment_dialog_key,
            rootClass: "md:w-1/2 sm:w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}

export function hideAppointmentDialog() {
    return(dispatch)=>
        dispatch(hideDialog(appointment_dialog_key));
}
