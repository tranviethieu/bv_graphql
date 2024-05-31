import graphqlService from 'app/services/graphqlService';
import { QUERY_CUSTOM_ENTITIES, SAVE_CUSTOM_ENTITY, REMOVE_CUSTOM_ENTITY, QUERY_EDITABLE_CLASSES,QUERY_CUSTOM_ENTITIES_GRAPH } from './query';

export function get_custom_entities(className,isObject, dispatch) {
    return graphqlService.query(QUERY_CUSTOM_ENTITIES, { className,isObject }, dispatch);
}
export function get_custom_entities_graph(className, dispatch) {
    return graphqlService.query(QUERY_CUSTOM_ENTITIES_GRAPH, { className }, dispatch);
}
export function get_editable_classes(dispatch) {
    return graphqlService.query(QUERY_EDITABLE_CLASSES, {}, dispatch);
}
export function save_custom_entity(data, dispatch) {
    return graphqlService.mutate(SAVE_CUSTOM_ENTITY, { data }, dispatch);
}
export function remove_custom_entity(_id, dispatch) {
    return graphqlService.mutate(REMOVE_CUSTOM_ENTITY, { _id }, dispatch);
}
