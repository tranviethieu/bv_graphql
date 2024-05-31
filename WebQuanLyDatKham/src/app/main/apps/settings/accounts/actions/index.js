import graphqlService from 'app/services/graphqlService';
import {
    QUERY_ACCOUNTS, QUERY_DEPARTMENTS, ALL_GROUP, MUTATION_SAVE_ACCOUNT, QUERY_ROOT_ACCOUNTS, QUERY_ORGANIZATIONS,
    MUTATION_DELETE_ACCOUNT, IMPORT_ACCOUNTS,
    QUERY_ROOT_DEPARTMENTS,
    QUERY_RINGGROUPS
} from './query';

export function get_ring_groups(dispatch) {
    return graphqlService.query(QUERY_RINGGROUPS, {}, dispatch);
}
export function get_root_department(dispatch) {
    return graphqlService.query(QUERY_ROOT_DEPARTMENTS, {}, dispatch);
}
export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_accounts(variables, dispatch) {
    return graphqlService.query(QUERY_ACCOUNTS, variables, dispatch);
}
export function get_departments(dispatch) {
    return graphqlService.query(QUERY_DEPARTMENTS, {}, dispatch);
}
export function get_groups(dispatch) {
    return graphqlService.query(ALL_GROUP, {}, dispatch);
}
export function save_account(account, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_ACCOUNT, { account }, dispatch);
}
export function remove_account(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_ACCOUNT, { _id }, dispatch);
}
export function get_root_accounts(dispatch) {
    return graphqlService.query(QUERY_ROOT_ACCOUNTS, {}, dispatch);
}
export function get_organizations(dispatch) {
    return graphqlService.query(QUERY_ORGANIZATIONS, {}, dispatch);
}
