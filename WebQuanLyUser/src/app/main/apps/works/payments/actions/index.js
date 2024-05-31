import graphqlService from 'app/services/graphqlService';
import {
    GET_APPOINTMENTS, GET_APPOINTMENT_DETAIL, GET_DEPARTMENTS, UPDATE_PATIENT, SEARCH_HIS_PATIENTS, GET_PATIENT,
    GET_SERVICES,
    CREATE_MEDICAL_SESSION,
    GET_ACCOUNT_BY_DEPARTMENT,
    GET_INDICATION,
    UPDATE_INDICATION_TRANSACTION,
    GET_INDICATIONS_BY_SESSION,
    GET_MEDICAL_SESSION_DETAIL,
    SEARCH_MEDICAL_SESSIONS,
    CREATE_MEDICAL_TRANSACTION,
    CREATE_INDICATION,
    QUERY_INDICATIONS
} from './query';

export const GET_INDICATION_STORE = '[INDICATION] GET INDICATION STORE'
export const ADD_INDICATION_STORE = '[INDICATION] ADD INDICATION STORE'
export const ADD_INDICATION_UPDATE_SERVER = '[INDICATION] ADD INDICATION UPDATE SERVER'
export const REMOVE_INDICATION_STORE = '[INDICATION] REMOVE INDICATION STORE'
export const SET_INDICATION_STORE = '[INDICATION] SET INDICATION STORE'
export const RESET_INDICATION_STORE = '[INDICATION] RESET INDICATION STORE'

export function search_medical_sessions(variables, dispatch) {
    return graphqlService.query(SEARCH_MEDICAL_SESSIONS, variables, dispatch);
}
export function get_medical_session_detail(_id, dispatch) {
    return graphqlService.query(GET_MEDICAL_SESSION_DETAIL, { _id }, dispatch);
}
export function get_indication_by_session(sessionCode, dispatch) {
  return (dispatch) => {
    graphqlService.query(GET_INDICATIONS_BY_SESSION, { sessionCode }).then(response =>
      dispatch({
        type: GET_INDICATION_STORE,
        payload: response.data
      })
    )
  }
    // return graphqlService.query(GET_INDICATIONS_BY_SESSION, { sessionCode }, dispatch);
}
export function set_indication_in_store(indications, dispatch){
  return (dispatch) =>{
    dispatch({
      type: SET_INDICATION_STORE,
      payload: indications
    })
  }
}
export function add_indication_in_store(indication, dispatch){
  return (dispatch) => {
    dispatch({
      type: ADD_INDICATION_STORE,
      payload: indication
    })
  }
}
export function add_indication_update_server(indication, dispatch){
  return (dispatch) => {
    dispatch({
      type: ADD_INDICATION_UPDATE_SERVER,
      payload: indication
    })
  }
}
export function remove_indication_in_store(indication, dispatch){
  return (dispatch) => {
    dispatch({
      type: REMOVE_INDICATION_STORE,
      payload: indication
    })
  }
}
export function reset_store(dispatch){
  return (dispatch) => {
    dispatch({
      type: RESET_INDICATION_STORE,
    })
  }
}
export function update_indication_transaction(variables, dispatch) {
    return graphqlService.mutate(UPDATE_INDICATION_TRANSACTION, variables, dispatch);
}
export function get_indication(_id, dispatch) {
    return graphqlService.query(GET_INDICATION, { _id }, dispatch);
}
export function get_account_by_department(code, dispatch) {
    return graphqlService.query(GET_ACCOUNT_BY_DEPARTMENT, { code }, dispatch);
}
export function save_medical_session(data, indications, dispatch) {
    return graphqlService.mutate(CREATE_MEDICAL_SESSION, { data, indications }, dispatch);
}
export function get_services(dispatch) {
    return graphqlService.query(GET_SERVICES, {}, dispatch);
}

export function get_departments(dispatch) {
    return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}

export function get_appointments(variables, dispatch) {
    return graphqlService.query(GET_APPOINTMENTS,
        variables,
        dispatch);
}

export function get_patient(patientCode, dispatch) {
    return graphqlService.query(GET_PATIENT, { patientCode }, dispatch);
}

export function get_appointment(_id, dispatch) {
    return graphqlService.query(GET_APPOINTMENT_DETAIL, { _id }, dispatch);
}

export function update_patient(data, dispatch) {
    return graphqlService.mutate(UPDATE_PATIENT, { data }, dispatch);
}

export function search_patient(data, dispatch) {
    return graphqlService.query(SEARCH_HIS_PATIENTS, { data }, dispatch);
}
//tạo 1 chỉ định chưa thanh toán
export function create_indication(data, dispatch){
  return graphqlService.mutate(CREATE_INDICATION, {data}, dispatch);
}
//thanh toán cho chỉ định
export function create_medical_transaction(indicationCode, patientCategory, note, dispatch){
  return graphqlService.mutate(CREATE_MEDICAL_TRANSACTION, {indicationCode, patientCategory, note}, dispatch);
}
//list chỉ định
export function get_indications(variables, dispatch){
  return graphqlService.query(QUERY_INDICATIONS, variables, dispatch);
}
