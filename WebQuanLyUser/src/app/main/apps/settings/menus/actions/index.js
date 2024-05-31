import graphqlService from 'app/services/graphqlService';
import * as graphqlServiceRoot from 'app/services/graphqlService/graphqlService_root';
import {
    SAVE_MENU, GET_MENU, GET_MENU_ALL, GET_MENU_GRAPH, REMOVE_MENU, GET_PERMISSIONS, GET_QUICK_ALL_MENU, GET_MENU_BY_GROUP, GET_MENU_GRAPH_BY_GROUP,
    DEVELOPERS,SAVE_DEVELOPER,REMOVE_DEVELOPER,GET_PROJECTS
} from './query'

export function get_projects(dispatch) {
    return graphqlServiceRoot.query(GET_PROJECTS, {}, dispatch);
}
export function getAll( dispatch){
    return graphqlService.query(GET_MENU_ALL, {}, dispatch);
}
export function get_menu_list_by_group(groupId, dispatch) {
    return graphqlService.query(GET_MENU_BY_GROUP, { groupId }, dispatch);
}
export function get_menu_graph_by_group(groupId, dispatch) {
    return graphqlService.query(GET_MENU_GRAPH_BY_GROUP, { groupId }, dispatch);
}
export function get_quick_all( dispatch){
    return graphqlService.query(GET_QUICK_ALL_MENU, {}, dispatch);
}
export function getGraph(dispatch){
    return graphqlService.query(GET_MENU_GRAPH, dispatch);
}
export function get(_id, dispatch){
    return graphqlService.query(GET_MENU, { _id }, dispatch);
}
export function remove(_id, dispatch){
    return graphqlService.mutate(REMOVE_MENU, { _id }, dispatch);
}
export async function save(data, dispatch){
    return graphqlService.mutate(SAVE_MENU, { data }, dispatch)
}
export async function testAsync(dispatch) {
    return graphqlService.query(DEVELOPERS, {}, dispatch);
}
export function getPermissions(dispatch) {
    return graphqlService.query(GET_PERMISSIONS, dispatch);
}
export function get_developers(dispatch) {
    return graphqlService.query(DEVELOPERS, {}, dispatch);
}
export function save_developer(data, dispatch) {
    return graphqlService.mutate(SAVE_DEVELOPER, { data }, dispatch);
}
export function remove_developer(_id, dispatch) {
    return graphqlService.mutate(REMOVE_DEVELOPER, { _id }, dispatch);
}
