import graphqlService from 'app/services/graphqlService';
import {
    QUERY_INDICATIONS,
    UPDATE_INDICATION_CONFIRM,
    UPDATE_INDICATION_RESULT
} from './query';
import { showDialog,hideDialog } from 'app/store/actions';
import ResultDialog from '../dialogs/ResultDialog'
import ResultPreviewDialog from '../dialogs/ResultPreviewDialog'
import React from 'react';

export function showResultDialog({ data, onSuccess}) {
    return (dispatch) => {
        const dialog = {
            children: <ResultDialog onSuccess={onSuccess} data={data}/>,
            id: "result_indication_dialog",
            rootClass: "md:w-1/3 sm:w-1/3",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function hideResultDialog() {
    return(dispatch)=>
        dispatch(hideDialog("result_indication_dialog"));
}

export function showResultPreviewDialog({ indications }) {
    return (dispatch) => {
        const dialog = {
            children: <ResultPreviewDialog indications={indications} />,
            id: "result_preview_indication_dialog",
            rootClass: "md:w-2/3 sm:w-2/3",
            className:"h-full"
        };
        dispatch(showDialog(dialog))
    }
}
export function hideResultPreviewDialog() {
    return(dispatch)=>
        dispatch(hideDialog("result_preview_indication_dialog"));
}

//list chỉ định
export function get_indications(variables, dispatch){
  return graphqlService.query(QUERY_INDICATIONS, variables, dispatch);
}
export function update_indication_result(_id, result, fileIds, dispatch){
  return graphqlService.mutate(UPDATE_INDICATION_RESULT, {_id, result, fileIds}, dispatch);
}
export function update_indication_confirm(_id, dispatch){
  return graphqlService.mutate(UPDATE_INDICATION_CONFIRM, {_id}, dispatch)
}
