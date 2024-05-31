import graphqlService from 'app/services/graphqlService';
import { QUERY_USERACTIONS, QUERY_USERACTION, MUTATION_REMOVE_USERACTION } from './query';

export function getUserActions(variables,dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, variables, dispatch);
}
export function getUserAction(_id, dispatch) {
    return graphqlService.query(QUERY_USERACTION, {_id}, dispatch)
}
export function deleteUserAction(_id, dispatch) {
    return graphqlService.mutate(MUTATION_REMOVE_USERACTION, {_id}, dispatch)
}