import graphqlService from 'app/services/graphqlService';
import {QUERY_MEDICALSERVICES, QUERY_CATEGORIES,MUTATION_SAVE_MEDICALSERVICE,MUTATION_DELETE_MEDICALSERVICE,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_medical_services(variables, dispatch) {
    return graphqlService.query(QUERY_MEDICALSERVICES, variables, dispatch);
}
export function get_categories(dispatch) {
    return graphqlService.query(QUERY_CATEGORIES, {}, dispatch);
}
export function save_medical_service(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_MEDICALSERVICE, { data }, dispatch);
}
export function remove_medical_service(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_MEDICALSERVICE, { _id }, dispatch);
}
