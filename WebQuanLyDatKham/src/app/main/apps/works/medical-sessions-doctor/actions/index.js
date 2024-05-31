import graphqlService from 'app/services/graphqlService';
import { GET_MEDICAL_SESSIONS, GET_DEPARTMENTS, UPDATE_MEDICAL_SESSION_WAITING, UPDATE_MEDICAL_SESSION_CONCLUSION, GET_MEDICAL_SESSION_DETAIL, REMOVE_MEDICAL_SESSION_CONCLUSION, CREATE_REAPPOINTMENT, GET_TIMEFRAME, UPDATE_MEDICAL_SESSION_PRESCRIPTION, REMOVE_MEDICAL_SESSION_PRESCRIPTION, UPDATE_IMAGES_MEDICAL_SESSION_CONCLUSION } from './query';
import React from 'react';
import { showDialog, hideDialog } from 'app/store/actions';
import MedicalConclusionDialog from '../dialogs/MedicalConclusionDialog'
import ConclusionDialog from '../dialogs/ConclusionDialog'
import MedicalPrescriptionDialog from '../dialogs/MedicalPrescriptionDialog'
import PrescriptionDialog from '../dialogs/PrescriptionDialog'
import ReAppointmentDialog from '../dialogs/ReAppointmentDialog'
import moment from 'moment'

export const SET_CONCLUSION_STORE = '[CONCLUSION] SET CONCLUSION STORE'
export const ADD_CONCLUSION_STORE = '[CONCLUSION] ADD CONCLUSION STORE'
export const RESET_CONCLUSION_STORE = '[CONCLUSION] RESET CONCLUSION STORE'
export const REMOVE_CONCLUSION_STORE = '[CONCLUSION] REMOVE CONCLUSION STORE'

export const SET_PRESCRIPTION_STORE = '[PRESCRIPTION] SET PRESCRIPTION STORE'
export const ADD_PRESCRIPTION_STORE = '[PRESCRIPTION] ADD PRESCRIPTION STORE'
export const RESET_PRESCRIPTION_STORE = '[PRESCRIPTION] RESET PRESCRIPTION STORE'
export const REMOVE_PRESCRIPTION_STORE = '[PRESCRIPTION] REMOVE PRESCRIPTION STORE'

// Các dialog kết luận khám
export function showMedicalConclusionDialog({ data, onSuccess, _id, code }) {
  return (dispatch) => {
    const dialog = {
      children: <MedicalConclusionDialog onSuccess={onSuccess} data={data} _id={_id} />,
      id: "medical_conclusion_dialog",
      rootClass: "md:w-1/2 sm:w-1/2",
      className: "h-full"
    };
    dispatch(showDialog(dialog))
  }
}
export function hideMedicalConclusionDialog() {
  return (dispatch) =>
    dispatch(hideDialog("medical_conclusion_dialog"));
}
//
export function showConclusionDialog({ data, onSuccess, sessionId }) {
  return (dispatch) => {
    const dialog = {
      children: <ConclusionDialog onSuccess={onSuccess} data={data} sessionId={sessionId} />,
      id: "conclusion_dialog",
      rootClass: "md:w-1/2 sm:w-1/2",
      className: "h-full"
    };
    dispatch(showDialog(dialog))
  }
}
export function hideConclusionDialog() {
  return (dispatch) =>
    dispatch(hideDialog("conclusion_dialog"));
}
// Các dialog tái khám
export function showReExaminationDialog({ data, onSuccess, patientCode }) {
  return (dispatch) => {
    const dialog = {
      children: <ReAppointmentDialog onSuccess={onSuccess} data={data} patientCode={patientCode} />,
      id: "reExamination_dialog",
      rootClass: "md:w-2/3 sm:w-2/3",
      className: "h-full"
    };
    dispatch(showDialog(dialog))
  }
}
export function hideReExaminationDialog() {
  return (dispatch) =>
    dispatch(hideDialog("reExamination_dialog"));
}
// Các dialog Đơn thuốc
export function showMedicalPrescriptionDialog({ data, onSuccess, _id, code }) {
  return (dispatch) => {
    const dialog = {
      children: <MedicalPrescriptionDialog onSuccess={onSuccess} data={data} _id={_id} />,
      id: "medical_prescription_dialog",
      rootClass: "md:w-1/2 sm:w-1/2",
      className: "h-full"
    };
    dispatch(showDialog(dialog))
  }
}
export function hideMedicalPrescriptionDialog() {
  return (dispatch) =>
    dispatch(hideDialog("medical_prescription_dialog"));
}
export function showPrescriptionDialog({ data, onSuccess, code }) {
  return (dispatch) => {
    const dialog = {
      children: <PrescriptionDialog onSuccess={onSuccess} data={data} code={code} />,
      id: "prescription_dialog",
      rootClass: "md:w-2/3 sm:w-2/3",
      className: "h-full"
    };
    dispatch(showDialog(dialog))
  }
}
export function hidePrescriptionDialog() {
  return (dispatch) =>
    dispatch(hideDialog("prescription_dialog"));
}
export function remove_conclusion_in_store(conclusionCode, dispatch) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CONCLUSION_STORE,
      payload: conclusionCode
    })
  }
}
//
export function set_conclusion_in_store(conclusions, dispatch) {
  return (dispatch) => {
    dispatch({
      type: SET_CONCLUSION_STORE,
      payload: conclusions
    })
  }
}
export function add_conclusion_in_store(conclusion, dispatch) {
  return (dispatch) => {
    dispatch({
      type: ADD_CONCLUSION_STORE,
      payload: conclusion
    })
  }
}
export function reset_store(dispatch) {
  return (dispatch) => {
    dispatch({
      type: RESET_CONCLUSION_STORE,
    })
  }
}
//
export function remove_prescription_in_store(prescriptionId, dispatch) {
  return (dispatch) => {
    dispatch({
      type: REMOVE_PRESCRIPTION_STORE,
      payload: prescriptionId
    })
  }
}
export function set_prescription_in_store(prescriptions, dispatch) {
  return (dispatch) => {
    dispatch({
      type: SET_PRESCRIPTION_STORE,
      payload: prescriptions
    })
  }
}
export function add_prescription_in_store(prescription, dispatch) {
  return (dispatch) => {
    dispatch({
      type: ADD_PRESCRIPTION_STORE,
      payload: prescription
    })
  }
}
export function reset_store_prescription(dispatch) {
  return (dispatch) => {
    dispatch({
      type: RESET_PRESCRIPTION_STORE,
    })
  }
}
//
export function get_departments(dispatch) {
  return graphqlService.query(GET_DEPARTMENTS, {}, dispatch);
}

export function get_medical_sessions(variables, dispatch) {
  return graphqlService.query(GET_MEDICAL_SESSIONS, variables, dispatch);
}
export function update_medical_session_waiting(code, dispatch) {
  return graphqlService.mutate(UPDATE_MEDICAL_SESSION_WAITING, { code }, dispatch);
}
export function update_medical_session_conclusion(sessionId, data, dispatch) {
  return graphqlService.mutate(UPDATE_MEDICAL_SESSION_CONCLUSION, { sessionId, data }, dispatch);
}
export function get_medical_session_detail(_id, dispatch) {
  return graphqlService.query(GET_MEDICAL_SESSION_DETAIL, { _id }, dispatch);
}
export function remove_medical_conclusion(sessionId, code, dispatch) {
  return graphqlService.mutate(REMOVE_MEDICAL_SESSION_CONCLUSION, { sessionId, code }, dispatch)
}
export function update_images_medical_conclusion(sessionId, fileIds, dispatch) {
  return graphqlService.mutate(UPDATE_IMAGES_MEDICAL_SESSION_CONCLUSION, { sessionId, fileIds }, dispatch)
}
export function create_reappointment(patientCode, appointmentDate, appointmentTime, dispatch) {
  return graphqlService.mutate(CREATE_REAPPOINTMENT, { patientCode, appointmentDate, appointmentTime, dispatch });
}
export function get_timeframe(_id, date, dispatch) {
  return graphqlService.query(GET_TIMEFRAME, { _id, date: moment(date).format("YYYY-MM-DD") }, dispatch);
}
export function update_medical_session_prescription(data, dispatch) {
  return graphqlService.mutate(UPDATE_MEDICAL_SESSION_PRESCRIPTION, { data }, dispatch);
}
export function remove_medical_prescription(_id, dispatch) {
  return graphqlService.mutate(REMOVE_MEDICAL_SESSION_PRESCRIPTION, { _id }, dispatch)
}
