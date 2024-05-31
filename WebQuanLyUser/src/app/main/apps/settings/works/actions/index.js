import graphqlService from 'app/services/graphqlService';
import {QUERY_WORKS,MUTATION_SAVE_WORK,MUTATION_DELETE_WORK,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_works(variables, dispatch) {
    return graphqlService.query(QUERY_WORKS, variables, dispatch);
}
export function save_work(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_WORK, { data }, dispatch);
}
export function remove_work(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_WORK, { _id }, dispatch);
}
