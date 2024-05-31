import graphqlService from 'app/services/graphqlService';
import * as graphqlServiceUser from 'app/services/graphqlService/graphqlService_user'
import moment from 'moment';
import {
    GET_APPOINTMENT_DETAIL, QUERY_WARDS, QUERY_NATIONS, QUERY_PROVINCES, QUERY_NATIONALITYS, QUERY_DISTRICTS, QUERY_USER_BY_PHONE, QUERY_USER_BY_ID,
    MUTATION_SAVE_USER,
    SEARCH_HIS_PATIENTS,
    UPDATE_PATIENT,
    GET_PATIENT,
    UPDATE_APPOINTMENT_STATE,
    GET_DEPARTMENTS,
    CREATE_APPOINTMENT,
    GET_TIMEFRAME,
    QUERY_WORKS,
    QUERY_SHIFT_DOCTORS
} from './query';

export function get_timeframe(_id, date, dispatch) {
    return graphqlService.query(GET_TIMEFRAME, { _id, date: moment(date).format("YYYY-MM-DD") }, dispatch);
}
export function create_appointment(data, dispatch) {
    return graphqlService.mutate(CREATE_APPOINTMENT, { data }, dispatch);
}
export function get_departments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}
export function update_appointment_state(_id, state, terminateReason, dispatch) {
    return graphqlService.mutate(UPDATE_APPOINTMENT_STATE, { _id, state, terminateReason }, dispatch);
}
export function get_patient(patientCode, dispatch) {
    return graphqlService.query(GET_PATIENT, { patientCode }, dispatch);
}
export function update_patient(data, dispatch) {
    return graphqlService.mutate(UPDATE_PATIENT, { data }, dispatch);
}

export function search_patient(data, dispatch) {
    return graphqlService.query(SEARCH_HIS_PATIENTS, { data }, dispatch);
}
export function get_appointment(_id, dispatch) {
    return graphqlService.query(GET_APPOINTMENT_DETAIL, { _id }, dispatch);
}
export function getUserByPhone(phoneNumber, dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber }, dispatch);
}

export function getUserById(_id, dispatch) {
    return graphqlService.query(QUERY_USER_BY_ID, { _id }, dispatch);
}
export function saveUser(user, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_USER, { data: user }, dispatch);
}
export function get_wards(variables, dispatch) {
    return graphqlService.query(QUERY_WARDS, variables, dispatch);
}
export function get_districts(variables, dispatch) {
    return graphqlService.query(QUERY_DISTRICTS, variables, dispatch);
}
export function get_provinces(dispatch) {
    return graphqlService.query(QUERY_PROVINCES, {}, dispatch);
}
export function get_works(dispatch) {
    return graphqlService.query(QUERY_WORKS, {}, dispatch);
}
export function get_nations(dispatch) {
    return graphqlService.query(QUERY_NATIONS, {}, dispatch);
}
export function get_nationalitys(dispatch) {
    return graphqlService.query(QUERY_NATIONALITYS, {}, dispatch);
}
//GET DOCTORS
export function getShiftDoctors(departmentId, date, dispatch) {
    return graphqlServiceUser.query(QUERY_SHIFT_DOCTORS, { departmentId, date }, dispatch) //dùng user service vì hàm lấy bác sĩ này làm ở bên đặt UserApi trước rồi, ko viết lại nữa
}