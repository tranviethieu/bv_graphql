import graphqlService from 'app/services/graphqlService';
import {QUERY_DISTRICTS, QUERY_PROVINCES, QUERY_WARDS, MUTATION_SAVE_WARD, MUTATION_DELETE_WARD,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_wards(variables, dispatch) {
    return graphqlService.query(QUERY_WARDS, variables, dispatch);
}
export function get_districts(dispatch) {
    return graphqlService.query(QUERY_DISTRICTS, {}, dispatch);
}
export function get_provinces(dispatch) {
    return graphqlService.query(QUERY_PROVINCES, {}, dispatch);
}
export function save_ward(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_WARD, { data }, dispatch);
}
export function remove_ward(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_WARD, { _id }, dispatch);
}
