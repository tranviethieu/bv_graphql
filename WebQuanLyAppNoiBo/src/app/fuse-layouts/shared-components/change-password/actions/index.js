import graphqlService from 'app/services/graphqlService';
import { CHANGE_PASSWORD } from './query';

export function change_password(variables, dispatch) {
    return graphqlService.mutate(CHANGE_PASSWORD, variables, dispatch);
}