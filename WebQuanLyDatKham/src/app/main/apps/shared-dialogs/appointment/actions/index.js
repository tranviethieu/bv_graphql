import graphqlService from 'app/services/graphqlService';
import moment from 'moment';
import {
    GET_APPOINTMENT_DETAIL, QUERY_WARDS, QUERY_NATIONS, QUERY_PROVINCES, QUERY_NATIONALITYS, QUERY_DISTRICTS, QUERY_USER_BY_PHONE, QUERY_USER_BY_ID,
    MUTATION_SAVE_USER,
    SEARCH_HIS_PATIENTS,
    Get_PATIENTS_TO_MERGE,
    MERGE_PATIENTS,
    UPDATE_PATIENT,
    GET_PATIENT,
    UPDATE_APPOINTMENT_STATE,
    GET_DEPARTMENTS,
    QUERY_SERVICE_DEMAND_LIST,
    GET_MEDICAL_SESSIONS_BY_PATIENT,
    CREATE_INDICATION,
    QUERY_INDICATION_BY_SESSION,
    CREATE_APPOINTMENT,
    GET_TIMEFRAME,
    QUERY_MEDICALSERVICES,
    QUERY_WORKS,
    CREATE_MEDICAL_SESSION
} from './query';

export function get_timeframe(_id, date, dispatch) {
    return graphqlService.query(GET_TIMEFRAME, { _id, date:moment(date).format("YYYY-MM-DD") }, dispatch);
}
export function create_appointment(data, serviceIds, dispatch) {
    return graphqlService.mutate(CREATE_APPOINTMENT, { data, serviceIds }, dispatch);
}
export function get_departments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}
export function get_services(dispatch) {
    return graphqlService.query(QUERY_SERVICE_DEMAND_LIST, {}, dispatch);
}
export function update_appointment_state(_id, state, terminateReason, dispatch) {
    return graphqlService.mutate(UPDATE_APPOINTMENT_STATE, { _id, state, terminateReason }, dispatch);
}
export function get_patient(patientCode, dispatch) {
    return graphqlService.query(GET_PATIENT, {patientCode}, dispatch);
}
export function update_patient(data, dispatch) {
    return graphqlService.mutate(UPDATE_PATIENT, { data }, dispatch);
}

export function get_patient_to_merge(data, dispatch) {
    return graphqlService.query(Get_PATIENTS_TO_MERGE, { data }, dispatch);
}
export function merge_patient(data, dispatch) {
    return graphqlService.query(MERGE_PATIENTS,data, dispatch);
}

export function search_patient(data, dispatch) {
    return graphqlService.query(SEARCH_HIS_PATIENTS, { data }, dispatch);
}
export function get_appointment(_id, dispatch) {
    return graphqlService.query(GET_APPOINTMENT_DETAIL, { _id }, dispatch);
}
export function getUserByPhone(phoneNumber,dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber }, dispatch);
}

export function getUserById(_id, dispatch) {
    return graphqlService.query(QUERY_USER_BY_ID, { _id }, dispatch);
}
export function saveUser(user, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_USER, { data: user }, dispatch);
}
export function get_wards(variables,dispatch) {
    return graphqlService.query(QUERY_WARDS, variables, dispatch);
}
export function get_districts(variables,dispatch) {
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
export function get_session_history(code, dispatch) {
    return graphqlService.query(GET_MEDICAL_SESSIONS_BY_PATIENT, { code }, dispatch);
}
export function get_medical_services(dispatch) {
    return graphqlService.query(QUERY_MEDICALSERVICES, dispatch);
}
export function create_indication(data, dispatch){
  return graphqlService.mutate(CREATE_INDICATION, {data}, dispatch);
}
export function get_indication_history(code, dispatch) {
    return graphqlService.query(QUERY_INDICATION_BY_SESSION, { code }, dispatch);
}
export function create_medical_session(data, dispatch) {
    return graphqlService.mutate(CREATE_MEDICAL_SESSION, {data}, dispatch);
}