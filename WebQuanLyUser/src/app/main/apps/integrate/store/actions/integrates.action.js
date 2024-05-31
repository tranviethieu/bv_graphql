import graphqlService from 'app/services/graphqlService';
import {
    MUTATION_SAVE_INTEGRATED_ACCOUNT, MUTATION_SAVE_INTEGRATE_CHANNEL,
    MUTATION_SUBCRIBED_CHANNEL, MUTATION_UNSUBCRIBED_CHANNEL, MUTATION_DISABLE_INTEGRATED_ACCOUNT,
    QUERY_INTEGRATED_ACCOUNT, QUERY_INTEGRATED_ACCOUNTS,
    MUTATION_SAVE_BOT_TEMPLATE
} from './query';
import { showMessage } from 'app/store/actions';


export const SHOW_DRAWER = '[INTEGRATES APP] SHOW DRAWER';
export const HIDE_DRAWER = '[INTEGRATES APP] HIDE DRAWER';
export const GET_INTEGRATES = '[INTEGRATES APP] GET INTEGRATES';
export const DISABLE_INTEGRATED_ACCOUNT = '[INTEGRATES APP] DISABLE SELECTED ACCOUNT';

export function showDrawer(type) {
    return (dispatch) =>
        graphqlService.query(QUERY_INTEGRATED_ACCOUNT, { type }, dispatch).then(response => {
            dispatch({
                type: SHOW_DRAWER,
                payload: { ...response.data,type }
            })        
        })
    
}

export function hideDrawer() {
    return (dispatch) => dispatch({
        type:HIDE_DRAWER
    })
}
export function getIntegrateAccounts() {
    return (dispatch) => graphqlService.query(QUERY_INTEGRATED_ACCOUNTS, {}, dispatch).then(response => {
        dispatch({
            type: GET_INTEGRATES,
            payload:response.data
        })
    })
}

export function saveIntegratedAccount(data, keepDrawer) {
    console.log("keepDrawer=", keepDrawer);
    return(dispatch)=>
        graphqlService.mutate(MUTATION_SAVE_INTEGRATED_ACCOUNT, { data }, dispatch).then(response => {
            if (!keepDrawer) {
                Promise.all([
                    dispatch(showMessage({ message: "Lưu cấu hình thành công" })),
                    dispatch(hideDrawer())
                ]).then(_ => dispatch(getIntegrateAccounts()))
            } else {
                Promise.all([
                    dispatch(showMessage({ message: "Lưu cấu hình thành công" })),
                    dispatch({
                        type: SHOW_DRAWER,
                        payload: { ...response.data }
                    })   
                ])
                
            }
        });
}

export function disableIntegratedAccount(_id) {
    return (dispatch) => {
        graphqlService.mutate(MUTATION_DISABLE_INTEGRATED_ACCOUNT, { _id }, dispatch).then(response => {
            dispatch({
                type: DISABLE_INTEGRATED_ACCOUNT,
                data:response.data
            })
        })
    }
}
// export function saveIntegratedAccount(data, dispatch) {
//     return graphqlService.mutate(MUTATION_SAVE_INTEGRATED_ACCOUNT, { data }, dispatch);
// }
export function saveIntegratedChannel(data){
    return graphqlService.mutate(MUTATION_SAVE_INTEGRATE_CHANNEL,  {data });
}

export function subcribedChannel(_id){
    return graphqlService.mutate(MUTATION_SUBCRIBED_CHANNEL,  {_id});
}
export function unSubcribedChannel(_id){
    return graphqlService.mutate(MUTATION_UNSUBCRIBED_CHANNEL,  {_id});
}
export function saveBotTemplate(_id, data,dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_BOT_TEMPLATE, { _id, data }, dispatch);
}