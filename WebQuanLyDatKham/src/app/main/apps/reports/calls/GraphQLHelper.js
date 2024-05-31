import graphqlService from "app/services/graphqlService";
import { QUERY_CALLIN_REPORT_BYAGENT, QUERY_CALLOUT_REPORT_BYAGENT, QUERY_GET_ACCOUNTS , QUERY_CALLIN_REPORT_BYRINGGROUP, QUERY_RINGGROUPS} from "./query";

export function getCallInReportByRingGroup(params, dispatch) {
    return graphqlService.query(QUERY_CALLIN_REPORT_BYRINGGROUP, params, dispatch);
}

export function getCallInReportByAgent(params, dispatch) {
    return graphqlService.query(QUERY_CALLIN_REPORT_BYAGENT, params, dispatch);
}

export function getCallOutReportByAgent(params, dispatch) {
    return graphqlService.query(QUERY_CALLOUT_REPORT_BYAGENT, params, dispatch);
}

export function getAccounts(params, dispatch) {
    return graphqlService.query(QUERY_GET_ACCOUNTS, params, dispatch);
}

export function getRingGroups(params, dispatch) {
    return graphqlService.query(QUERY_RINGGROUPS, params, dispatch);
}

// export function getUserActions(params, dispatch) {
//     return graphqlService.query(QUERY_USERACTIONS, params, dispatch);
// }
