import graphqlService from 'app/services/graphqlService';
import { QUERY_DEPARTMENTS, QUERY_REPORT_APPOINTMENT_BYDAY, QUERY_REPORT_APPOINTMENT_INDEX,QUERY_USERACTIONS } from './query';


export function getReportAppointmentIndex(params, dispatch) {
    return graphqlService.query(QUERY_REPORT_APPOINTMENT_INDEX, params, dispatch);
}
export function getDepartments(dispatch) {
    return graphqlService.query(QUERY_DEPARTMENTS, {}, dispatch);
}
export function getReportAppointmentByDay(params, dispatch) {
    return graphqlService.query(QUERY_REPORT_APPOINTMENT_BYDAY, params, dispatch);
}
export function getUserActions(params, dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, params, dispatch);
}