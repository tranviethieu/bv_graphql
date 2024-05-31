
import graphqlService from '../../../services/graphqlService';
import {
    QUERY_GET_DEPARTMENTS,
    QUERY_GET_TIME_FRAMES,
    MUTATION_CREATE_APPOINMENT_UNAUTHORIZE,
    QUERY_SERVICE_DEMAND,
    QUERY_SERVICE_DEMAND_LIST,
    GET_DISTRICTS,
    GET_PROVINCES,
    GET_WARDS,
    QUERY_WORKS,
    QUERY_NATIONS,
    QUERY_NATIONALITYS,
    QUERY_SHIFT_DOCTORS,
    QUERY_BOOKING
} from './query'



export function get_provinces(dispatch) {
    return graphqlService.query(GET_PROVINCES, {}, dispatch);
}
export function get_districts(provinceCode, dispatch) {
    return graphqlService.query(GET_DISTRICTS, { provinceCode }, dispatch);
}
export function get_wards(districtCode, dispatch) {
    return graphqlService.query(GET_WARDS, { districtCode }, dispatch);
}
export function getService(parentId, dispatch) {
    return graphqlService.query(QUERY_SERVICE_DEMAND, { parentId }, dispatch);
}
export function getServiceList(dispatch) {
    return graphqlService.query(QUERY_SERVICE_DEMAND_LIST, {}, dispatch);
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

//GET DEPARTMENTS
export function getDepartments(dispatch) {
    return graphqlService.query(QUERY_GET_DEPARTMENTS, {}, dispatch);
}

//GET TIME FRAMES
export function getTimeFrames(_id, date, dispatch) {
    return graphqlService.query(QUERY_GET_TIME_FRAMES, { _id, date }, dispatch)
}

//CREATE APPOINTMENT
export function createAppoinmentUnauthorize(data, paymentMethod, dispatch) {
    return graphqlService.mutate(MUTATION_CREATE_APPOINMENT_UNAUTHORIZE, { data, paymentMethod }, dispatch)
}

//GET DOCTORS
export function getShiftDoctors(departmentId, date, dispatch) {
    return graphqlService.query(QUERY_SHIFT_DOCTORS, { departmentId, date }, dispatch)
}

export function getBookingInfo(sessionId, url, dispatch) {
    return graphqlService.query(QUERY_BOOKING, { sessionId, url }, dispatch, false)
}