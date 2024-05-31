import graphqlService from 'app/services/graphqlService';
import {QUERY_SUPPLYCATEGORIES,MUTATION_SAVE_SUPPLYCATEGORY,MUTATION_DELETE_SUPPLYCATEGORY,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_supply_categories(variables, dispatch) {
    return graphqlService.query(QUERY_SUPPLYCATEGORIES, variables, dispatch);
}
export function save_supply_category(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_SUPPLYCATEGORY, { data }, dispatch);
}
export function remove_supply_category(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_SUPPLYCATEGORY, { _id }, dispatch);
}
