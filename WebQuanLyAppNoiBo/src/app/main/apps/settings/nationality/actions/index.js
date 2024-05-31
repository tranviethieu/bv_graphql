import graphqlService from 'app/services/graphqlService';
import {QUERY_NATIONALITY,MUTATION_SAVE_NATIONALITY,MUTATION_DELETE_NATIONALITY,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_nationality(variables, dispatch) {
    return graphqlService.query(QUERY_NATIONALITY, variables, dispatch);
}
export function save_nationality(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_NATIONALITY, { data }, dispatch);
}
export function remove_nationality(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_NATIONALITY, { _id }, dispatch);
}
