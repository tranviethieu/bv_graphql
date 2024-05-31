import graphqlService from 'app/services/graphqlService';
import {QUERY_DISTRICTS, QUERY_PROVINCES, MUTATION_SAVE_DISTRICT, MUTATION_DELETE_DISTRICT,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_districts(variables, dispatch) {
    return graphqlService.query(QUERY_DISTRICTS, variables, dispatch);
}
export function get_provinces(dispatch) {
    return graphqlService.query(QUERY_PROVINCES, {}, dispatch);
}
export function save_district(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_DISTRICT, { data }, dispatch);
}
export function remove_district(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_DISTRICT, { _id }, dispatch);
}
