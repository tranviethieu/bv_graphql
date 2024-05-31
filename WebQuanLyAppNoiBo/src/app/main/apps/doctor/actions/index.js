import graphqlService from 'app/services/graphqlService';
import {
    QUERY_ACCOUNTS,
    QUERY_GET_RATTING,
} from './query';

export function getAccounts(variables, dispatch) {
    return graphqlService.query(QUERY_ACCOUNTS, variables, dispatch)
}
export function getRattings(variables, dispatch) {
    return graphqlService.query(QUERY_GET_RATTING, variables, dispatch)
}