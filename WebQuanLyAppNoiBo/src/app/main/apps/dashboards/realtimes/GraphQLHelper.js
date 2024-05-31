import graphqlService from "app/services/graphqlService";
import { QUERY_USERACTIONS, QUERY_REPORT_APPOINTMENT_INDEX,GET_APPOINTMENTS } from "./query";

export function get_appointments(params, dispatch) {
    return graphqlService.query(GET_APPOINTMENTS, params, dispatch);
}
export function getUserActions(params, dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, params, dispatch);
}

export function getReportAppointmentIndex(params, dispatch) {
    return graphqlService.query(QUERY_REPORT_APPOINTMENT_INDEX, params, dispatch);
}
