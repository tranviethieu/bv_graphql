import { QUERY_MY_ACTIONS, QUERY_CALL_LOGS } from "./query";
import graphqlService from 'app/services/graphqlService';

export const TOGGLE_QUICK_PANEL = '[QUICK PANEL] TOGGLE QUICK PANEL';
export const GET_QUICK_PANEL_DATA = '[QUICK PANEL] GET DATA';

export function getQuickPanelData(variables)
{
    // const request = axios.get('/api/quick-panel/data');
    return (dispatch) =>
        graphqlService.query(QUERY_MY_ACTIONS, variables, dispatch).then((response) =>
            dispatch({
                type   : GET_QUICK_PANEL_DATA,
                payload: response
            })
        );
}

export function toggleQuickPanel()
{
    return {
        type: TOGGLE_QUICK_PANEL
    }
}
export function getCallLogsByPhone(variables, dispatch){
  return graphqlService.query(QUERY_CALL_LOGS, variables, dispatch)
}
