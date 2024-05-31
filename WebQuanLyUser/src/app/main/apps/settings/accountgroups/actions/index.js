import graphqlService from 'app/services/graphqlService';
import { ALL_GROUP, ALL_PERMISSION, GET, REMOVE, SAVE,MENU_PERMISSIONS ,DEPARTMENTS} from './query';


export function allMenu(dispatch) {
    return graphqlService.query(MENU_PERMISSIONS, {}, dispatch);
}
export function allGroup(dispatch) {
    return graphqlService.query(ALL_GROUP, {}, dispatch);
}
export function get(_id, dispatch) {
    return graphqlService.query(GET, { _id }, dispatch);
}

export function allPermission(dispatch) {
    return graphqlService.query(ALL_PERMISSION, {}, dispatch);
}
export function save(data,dispatch) {
    return graphqlService.mutate(SAVE, { data }, dispatch);
}
export function remove(_id,dispatch) {
    return graphqlService.mutate(REMOVE, { _id }, dispatch);
}
export function departments(dispatch) {
    return graphqlService.query(DEPARTMENTS, {}, dispatch);
}