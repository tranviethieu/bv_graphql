import graphqlService from 'app/services/graphqlService';
import {
    QUERY_USERACTIONS, QUERY_USERACTION, MUTATION_CHANGE_STATE_APPOINTMENT, MUTATION_CHANGE_STATE_TICKET, QUERY_DEPARTMENTS, QUERY_DEPARTMENT,
    MUTATION_SAVE_USER, QUERY_USER_BY_PHONE,
    GET_APPOINTMENT_DETAIL
} from './query';

export const GET_APPOINTMENTS = '[USERACTIONS APP] GET APPOINTMENTS';

export function get_appointment(_id, dispatch) {
    return graphqlService.query(GET_APPOINTMENT_DETAIL, { _id }, dispatch);
}
export function getUserActions(variables,dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, variables, dispatch);
}
export function getUserAction(_id, dispatch) {
    return graphqlService.query(QUERY_USERACTION, {_id}, dispatch)
}
export function saveUser(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_USER, { data }, dispatch);
}

export function getUserByPhone(phoneNumber,dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber }, dispatch);
}

export function getDepartments(variables, dispatch){
    return graphqlService.query(QUERY_DEPARTMENTS, {variables}, dispatch);
}
export function getDepartment(_id, dispatch){
    return graphqlService.query(QUERY_DEPARTMENT, {_id} , dispatch )
}
export function changeStateAppointment(_id, state, dispatch){
    return graphqlService.mutate(MUTATION_CHANGE_STATE_APPOINTMENT, {_id, state}, dispatch)
}
export function changeStateTicket(_id, state, dispatch){
    return graphqlService.mutate(MUTATION_CHANGE_STATE_TICKET, {_id, state}, dispatch)
}
