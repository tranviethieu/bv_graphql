import graphqlService from 'app/services/graphqlService';
import * as graphqlUserService from 'app/services/graphqlService/graphqlUserService';
import { showMessage } from 'app/store/actions'

import history from '@history';
import {
    QUERY_ACCOUNTS,
    MUTATION_NOTIFY_SEND_ALL,
    MUTATION_NOTIFY_SEND_BY_USERIDS,
    QUERY_NOTIFICATION_QUEUES,
    QUERY_NOTIFICATION_SENDS,
} from './query'

export function getAccounts(dispatch) {
    return graphqlService.query(QUERY_ACCOUNTS, {}, dispatch)
}

export function notifiSendAll(data, dispatch) {
    return graphqlService.mutate(MUTATION_NOTIFY_SEND_ALL, { data }, dispatch)
}

export function notifiSendByIds(userids, data, dispatch) {
    return graphqlService.mutate(MUTATION_NOTIFY_SEND_BY_USERIDS, { userids, data }, dispatch)
}

export function getNotificationQueues(variables, dispatch) {
    return graphqlService.query(QUERY_NOTIFICATION_QUEUES, variables, dispatch)
}
export function getNotificationSends(variables, dispatch) {
    return graphqlService.query(QUERY_NOTIFICATION_SENDS, variables, dispatch)
}