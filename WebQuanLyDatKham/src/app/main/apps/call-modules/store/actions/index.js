import graphqlService from 'app/services/graphqlService'

import {QUERY_MY_CALL_LOGS } from './query';
export const GET_CALLS = '[CALLSEVENT APP] GET CALLS';
export const SELECT_CALL = '[CALLSEVENT APP] SELECT CALL';
export const SET_CLICK_ITEM = '[CALLSEVENT APP] SET CLICK ITEM';

export function setClickItem(id) {
    return (dispatch) => dispatch({
        type: SET_CLICK_ITEM,
        data: id  
    })
}

export function getCalls(variables) {
    return (dispatch) => {
        graphqlService.query(QUERY_MY_CALL_LOGS, variables, dispatch).then(response => {
            dispatch({
                type: GET_CALLS,
                payload:response
            })
        });
    }
    
}
export function selecteCall(data) {
   
    return (dispatch) => dispatch({
        type: SELECT_CALL,
        data: data
    })
}