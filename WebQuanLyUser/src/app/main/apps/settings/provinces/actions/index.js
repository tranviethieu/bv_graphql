import graphqlService from 'app/services/graphqlService';
import {QUERY_PROVINCES,MUTATION_SAVE_PROVINCE,MUTATION_DELETE_PROVINCE,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_provinces(variables, dispatch) {
    return graphqlService.query(QUERY_PROVINCES, variables, dispatch);
}
export function save_province(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_PROVINCE, { data }, dispatch);
}
export function remove_province(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_PROVINCE, { _id }, dispatch);
}
