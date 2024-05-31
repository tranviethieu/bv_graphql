import graphqlService from "app/services/graphqlService";
import { QUERY_REPORT_APPOINTMENT_BYDAY, QUERY_DEPARTMENTS, QUERY_REPORT_APPOINTMENT_INDEX, QUERY_USERACTIONS, QUERY_JOB_GENERALREPORT, QUERY_JOB_SELFREPORT, QUERY_JOB_GENERALREPORT_DETAIL, QUERY_JOB_SELFREPORT_DETAIL} from "./queryReport";
export function getReportAppointmentByDay(params, dispatch) {
    return graphqlService.query(QUERY_REPORT_APPOINTMENT_BYDAY, params, dispatch);
}

export function getReportAppointmentIndex(params, dispatch) {
    return graphqlService.query(QUERY_REPORT_APPOINTMENT_INDEX, params, dispatch);
}
export function getDepartments(params, dispatch) {
    return graphqlService.query(QUERY_DEPARTMENTS, params, dispatch);
}

export function getUserActions(params, dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, params, dispatch);
}
// Báo cáo tổng quát tất cả các công việc theo khoảng thời gian
export function getJobGeneralReport(params, dispatch){
  return graphqlService.query(QUERY_JOB_GENERALREPORT, params, dispatch);
}
// Báo cáo tổng quát công việc của cá nhân người đăng nhập theo khoảng thời gian
export function getJobSelfReport(params, dispatch){
  return graphqlService.query(QUERY_JOB_SELFREPORT, params, dispatch);
}
// Báo cáo tổng quát tất cả các công việc theo mốc thời gian
export function getJobGeneralReportDetail(params, dispatch){
  return graphqlService.query(QUERY_JOB_GENERALREPORT_DETAIL, params, dispatch);
}
// Báo cáo tổng quát công việc của cá nhân người đăng nhập theo mốc thời gian
export function getJobSelfReportDetail(params, dispatch){
  return graphqlService.query(QUERY_JOB_SELFREPORT_DETAIL, params, dispatch);
}
