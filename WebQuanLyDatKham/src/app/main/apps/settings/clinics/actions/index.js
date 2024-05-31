import graphqlService from 'app/services/graphqlService';
import {QUERY_CLINICS, QUERY_DEPARTMENTS, MUTATION_SAVE_CLINIC, MUTATION_DELETE_CLINIC,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_clinics(variables, dispatch) {
    return graphqlService.query(QUERY_CLINICS, variables, dispatch);
}
export function get_departments(dispatch) {
    return graphqlService.query(QUERY_DEPARTMENTS, {}, dispatch);
}
export function save_clinic(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_CLINIC, { data }, dispatch);
}
export function remove_clinic(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_CLINIC, { _id }, dispatch);
}
