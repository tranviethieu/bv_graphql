import React from 'react';
import { showDialog,hideDialog } from 'app/store/actions';
import AppointmentDialog from '../appointment/AppointmentDialog';
import MergePatientDialog from '../appointment/MergePatientDialog';
import InfoDialog from '../appointment/InfoDialog'

const mergePatient_dialog_key = "mergePatient-dialog";
export function showMergePatientDialog({ user, onSelectPatient }) {
    // console.log("showQuickEditDialog");
    return (dispatch) => {
        const dialog = {
            children: <MergePatientDialog user={user} onSelectPatient={onSelectPatient}/>,
            id: mergePatient_dialog_key,
            rootClass: "md:w-2/3 sm:w-full",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
// export function showMergePatientStateDialog({ data ,onSuccess}) {
//     return (dispatch) => {
//         const dialog = {
//             children: <AppointmentDialog data={data} onSuccess={onSuccess}/>,
//             id: mergePatient_dialog_key,
//             rootClass: "md:w-2/3 sm:w-full",
//             className:"h-full"
//         };
//         dispatch(showDialog(dialog))
//     }
// }
// export function showInfoDialog({ data ,onSuccess, options}) {
//     return (dispatch) => {
//         const dialog = {
//             children: <InfoDialog data={data} onSuccess={onSuccess} options = {options}/>,
//             id: mergePatient_dialog_key,
//             rootClass: "md:w-1/2 sm:w-full",
//             className:"h-full"
//         };
//         dispatch(showDialog(dialog))
//     }
// }

export function hideMergePatientDialog() {
    return(dispatch)=>
        dispatch(hideDialog(mergePatient_dialog_key));
}
