import graphqlService from 'app/services/graphqlService';

import { GET_OPENCHANNEL_REPORT_INDEX ,GET_INTEGRAGED_USERS} from './query';

export function get_report_index(dispatch) {
    return graphqlService.query(GET_OPENCHANNEL_REPORT_INDEX, {}, dispatch);
}
export function get_integrated_users(variables, dispatch) {
    return graphqlService.query(GET_INTEGRAGED_USERS, variables, dispatch);
}