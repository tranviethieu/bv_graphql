import React from 'react';
import { QUERY_USER_BY_PHONE, QUERY_USER_BY_ID,QUERY_USER_HISTORY,MUTATION_SAVE_USER, QUERY_WORKS, QUERY_NATIONS, QUERY_NATIONALITYS} from './query';
import graphqlService from 'app/services/graphqlService';
import { showDialog } from 'app/store/actions';
import FloatUserDialog from '../../FloatUserDialog';
export { hideDialog} from 'app/store/actions';

export function showUserDialog({ rootClass, ...props }) {
    return (dispatch) => {
        const dialog = {
            children: <FloatUserDialog {...props} />,
            id: 'user-detail',
            rootClass: rootClass
        };
        dispatch(showDialog(dialog))
    }
}

export function getUserByPhone(phoneNumber,dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber }, dispatch);
}

export function getUserById(_id, dispatch) {
    return graphqlService.query(QUERY_USER_BY_ID, { _id }, dispatch);
}

export function getActions(params,dispatch) {
    return graphqlService.query(QUERY_USER_HISTORY, params, dispatch);
}
export function saveUser(user, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_USER, { data: user }, dispatch);
}
export function get_works(dispatch) {
    return graphqlService.query(QUERY_WORKS, {}, dispatch);
}
export function get_nations(dispatch) {
    return graphqlService.query(QUERY_NATIONS, {}, dispatch);
}
export function get_nationalitys(dispatch) {
    return graphqlService.query(QUERY_NATIONALITYS, {}, dispatch);
}
