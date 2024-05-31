import React from 'react';
import { QUERY_USER_BY_PHONE, QUERY_USER_BY_ID,QUERY_USER_HISTORY,MUTATION_SAVE_USER,QUERY_DEPARTMENTS, QUERY_DEPARTMENT,MUTATION_SAVE_USERACTION, MUTATION_CREATE_TICKET, MUTATION_CREATE_PRESCRIPTION, MUTATION_CREATE_EXAMINAION_RESULT, MUTATION_CREATE_SCAN_RESULT, MUTATION_CREATE_TEST_RESULT} from './query';
import {QUERY_WARDS, QUERY_NATIONS, QUERY_PROVINCES, QUERY_NATIONALITYS, QUERY_DISTRICTS} from './query'
import graphqlService from 'app/services/graphqlService';
import { showDialog } from 'app/store/actions';
import UserActionDialog from '../../BTH-dialogs';
export { hideDialog} from 'app/store/actions';

export function showUserActionDialog({ rootClass, ...props }) {
    return (dispatch) => {
        const dialog = {
            children: <UserActionDialog {...props}/>,
            id: props.type,
            rootClass: rootClass
        };
        dispatch(showDialog(dialog))
    }
}

export function getUserByPhone(phoneNumber,dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, { phoneNumber }, dispatch);
}

export function getUserById(_id, dispatch) {
    return graphqlService.query(QUERY_USER_BY_ID, { _id }, dispatch);
}

export function getActions(params,dispatch) {
    return graphqlService.query(QUERY_USER_HISTORY, params, dispatch);
}
export function saveUser(user, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_USER, { data: user }, dispatch);
}
//phần dành cho Tạo lịch khám
export function getDepartments(variables, dispatch){
    return graphqlService.query(QUERY_DEPARTMENTS, {variables}, dispatch);
}
export function getDepartment(_id, dispatch){
    return graphqlService.query(QUERY_DEPARTMENT, {_id} , dispatch )
}
export function saveUserAction(data, userId, dispatch){
    return graphqlService.mutate(MUTATION_SAVE_USERACTION, { data, userId }, dispatch);
}
//phần dành cho ticket
export function createTicket (userId, data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_TICKET, { userId, data }, dispatch);
}
//tạo đơn thuốc
export function createPrescription (userId, data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_PRESCRIPTION, { userId, data }, dispatch);
}
//tạo kết quả chụp chiếu
export function createScanResult (userId, data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_SCAN_RESULT, { userId, data }, dispatch);
}
//tạo kết quả xét nghiệm
export function createTestResult (userId, data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_TEST_RESULT, { userId, data }, dispatch);
}
//tạo kết quả khám
export function createExaminationResult (userId, data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_EXAMINAION_RESULT, { userId, data }, dispatch);
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
export function get_nations(dispatch) {
    return graphqlService.query(QUERY_NATIONS, {}, dispatch);
}
export function get_nationalitys(dispatch) {
    return graphqlService.query(QUERY_NATIONALITYS, {}, dispatch);
}
