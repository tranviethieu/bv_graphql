import graphqlService from 'app/services/graphqlService';
import {MUTATION_UPLOAD} from './query'
export function uploadAvatar(file, dispatch) {
    return graphqlService.mutate(MUTATION_UPLOAD, { file }, dispatch);
}