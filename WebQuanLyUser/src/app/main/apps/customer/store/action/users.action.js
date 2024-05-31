import { QUERY_GET_USERS  } from './query'
import graphqlService from 'app/services/graphqlService';

export function getUsers({page, pageSize, filtered, sorted}, dispatch)
{
    return graphqlService.query(QUERY_GET_USERS, {page, pageSize, filtered, sorted}, dispatch);
}   