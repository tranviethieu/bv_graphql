import * as graphqlService from 'app/services/graphqlService/graphqlService_user';

import { SUBMIT_SURVEY_RESULT,QUERY_GET_SURVEY } from './query';

export function get_survey(_id, dispatch){
    return graphqlService.query(QUERY_GET_SURVEY, { _id }, dispatch);
}
export function submit_result({ data, phoneNumber }, dispatch) {
    return graphqlService.mutate(SUBMIT_SURVEY_RESULT, { data, phoneNumber }, dispatch);
}
