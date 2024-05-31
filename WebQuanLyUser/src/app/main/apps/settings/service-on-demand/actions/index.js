import graphqlService from 'app/services/graphqlService';
import { GET_DEPARTMENTS, MUTATION_SAVE_SERVICE_DEMAND,  MUTATION_REMOVE_SERVICE_DEMAND, QUERY_GET_SERVICE_DEMANDS_CHART } from './query'

export function getDepartments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}
export function getGraph(dispatch){
    return graphqlService.query(QUERY_GET_SERVICE_DEMANDS_CHART, dispatch);
}

export function remove(_id, dispatch){
    return graphqlService.mutate(MUTATION_REMOVE_SERVICE_DEMAND, { _id }, dispatch);
}
export function save(data, dispatch){
    return graphqlService.mutate(MUTATION_SAVE_SERVICE_DEMAND, { data }, dispatch)
}
