import graphqlService from 'app/services/graphqlService';
import {QUERY_ARTICLES,MUTATION_SAVE_ARTICLE,MUTATION_DELETE_ARTICLE,IMPORT_ACCOUNTS} from './query';

export function import_accounts(data, dispatch) {
    return graphqlService.mutate(IMPORT_ACCOUNTS, { data }, dispatch);
}
export function get_articles(variables, dispatch) {
    return graphqlService.query(QUERY_ARTICLES, variables, dispatch);
}
export function save_article(data, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_ARTICLE, { data }, dispatch);
}
export function remove_article(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DELETE_ARTICLE, { _id }, dispatch);
}
