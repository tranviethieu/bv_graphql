import graphqlService from 'app/services/graphqlService';
import {QUERY_PATIENTCATEGORIES,MUTATION_SAVE_PATIENTCATEGORY,MUTATION_DELETE_PATIENTCATEGORY,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_patientcategories(variables, dispatch) {
    return graphqlService.query(QUERY_PATIENTCATEGORIES, variables, dispatch);
}
export function save_patientcategory(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_PATIENTCATEGORY, { data }, dispatch);
}
export function remove_patientcategory(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_PATIENTCATEGORY, { _id }, dispatch);
}
