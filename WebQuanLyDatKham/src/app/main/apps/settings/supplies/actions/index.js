import graphqlService from 'app/services/graphqlService';
import {QUERY_SUPPLIES, QUERY_CATEGORIES,MUTATION_SAVE_SUPPLY,MUTATION_DELETE_SUPPLY,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_supplies(variables, dispatch) {
    return graphqlService.query(QUERY_SUPPLIES, variables, dispatch);
}
export function get_categories(dispatch) {
    return graphqlService.query(QUERY_CATEGORIES, {}, dispatch);
}
export function save_supply(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_SUPPLY, { data }, dispatch);
}
export function remove_supply(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_SUPPLY, { _id }, dispatch);
}
