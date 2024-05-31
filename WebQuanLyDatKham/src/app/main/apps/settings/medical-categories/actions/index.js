import graphqlService from 'app/services/graphqlService';
import {QUERY_MEDICALCATEGORIES,MUTATION_SAVE_MEDICALCATEGORY,MUTATION_DELETE_MEDICALCATEGORY,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_medical_categories(variables, dispatch) {
    return graphqlService.query(QUERY_MEDICALCATEGORIES, variables, dispatch);
}
export function save_medical_category(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_MEDICALCATEGORY, { data }, dispatch);
}
export function remove_medical_category(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_MEDICALCATEGORY, { _id }, dispatch);
}
