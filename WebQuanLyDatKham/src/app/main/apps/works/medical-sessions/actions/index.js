import graphqlService from 'app/services/graphqlService';
import {GET_MEDICAL_SESSIONS,GET_DEPARTMENTS } from './query';

export function get_departments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}

export function get_medical_sessions(variables,dispatch) {
    return graphqlService.query( GET_MEDICAL_SESSIONS, variables, dispatch);
}
