import graphqlService from 'app/services/graphqlService';
import {QUERY_NATIONS,MUTATION_SAVE_NATION,MUTATION_DELETE_NATION,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_nations(variables, dispatch) {
    return graphqlService.query(QUERY_NATIONS, variables, dispatch);
}
export function save_nation(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_NATION, { data }, dispatch);
}
export function remove_nation(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_NATION, { _id }, dispatch);
}
