import graphqlService from 'app/services/graphqlService';
import {GET_APPOINTMENTS,GET_DEPARTMENTS } from './query';
import moment from 'moment';

export function get_departments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}

export function get_appointments(variables,dispatch) {
    return graphqlService.query( GET_APPOINTMENTS,
        variables,
        dispatch);
}