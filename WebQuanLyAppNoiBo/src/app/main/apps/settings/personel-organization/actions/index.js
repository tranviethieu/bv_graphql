import graphqlService from 'app/services/graphqlService';
import { MUTATION_SAVE_PERSONEL,  MUTATION_REMOVE_PERSONEL, QUERY_GET_PERSONELS_CHART,GET_ACCOUNTS } from './query'

export function getAccounts(dispatch) {
    return graphqlService.query(GET_ACCOUNTS, {}, dispatch);
}
export function getPersonelsGraph(dispatch){
    return graphqlService.query(QUERY_GET_PERSONELS_CHART, dispatch);
}

export function removePersonel(_id, dispatch){
    return graphqlService.mutate(MUTATION_REMOVE_PERSONEL, { _id }, dispatch);
}
export function savePersonel(data, dispatch){
    return graphqlService.mutate(MUTATION_SAVE_PERSONEL, { data }, dispatch)
}
