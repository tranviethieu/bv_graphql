import graphqlService from 'app/services/graphqlService';
import * as graphqlUserService from 'app/services/graphqlService/graphqlUserService';
import { showMessage } from 'app/store/actions'

import history from '@history';

import {
    MUTATION_DISABLE_SURVEY,
    MUTATION_SAVE_SURVEY,
    QUERY_GET_SURVEY,
    QUERY_GET_SURVEYS,
    QUERY_GET_USERINFO,
    MUTATION_CREATE_USER,
    MUTATION_SUBMIT_SURVEY_RESULT,
    QUERY_USER_SURVEY_HISTORY,
    QUERY_USER_BY_PHONE,
    QUERY_USERS_SEARCH_BY_SURVEY,
    QUERY_USER_ACTIONS_SEARCH_BY_SURVEY,
    GET_USER_ACTONS,
    GET_SURVEY_FREQUENCE_DATA,
    GET_QUESTIONS_ANALYSTIC_DATA,
    MUTATION_REMOVE_SURVEY,
    SURVEY_GENERAL_REPORT,
    MUTATION_SUBMIT_SURVEY_RESULT_EMPLOYEE,
    QUERY_GET_USERINFO_WITH_ID,
    QUERY_GET_SURVEY_RESULTS,
} from './query'

export const GET_SURVEY = '[SURVEY APP] GET SURVEY';
export const GET_SURVEYS = '[SURVEY APP] GET SURVEYS';
export const SAVE_SURVEY = '[SURVEY APP] SAVE SURVEY';
export const REMOVE_SURVEY = '[SURVEY APP] REMOVE SURVEY';
//các action liên quan đến thực thi survey thay khách hàng
export const CREATE_USER = '[SURVEY APP] CREATE USER';
export const GET_USERINFO = '[SURVEY APP] GET USERINFO';
export const SUBMIT_SURVEY_RESULT = '[SURVEY APP] SUBMIT SURVEY RESULT';

export function getSurveys(variables, dispatch) {
    return graphqlService.query(QUERY_GET_SURVEYS, variables, dispatch);
}
export function getSurvey(_id, dispatch) {
    return graphqlService.query(QUERY_GET_SURVEY, { _id }, dispatch);
}
export function getUserSurvey(_id, dispatch) {
    console.log("===> survey new function: ", _id)
    return graphqlUserService.query(QUERY_GET_SURVEY, { _id }, dispatch);
}
// export function saveSurvey(data, questions) {
//     return (dispatch) => {
//         graphqlService.mutate(MUTATION_SAVE_SURVEY, { data, questions }, dispatch).then(response =>
//             Promise.all([
//                 dispatch(showMessage({ message: "Lưu thông tin khảo sát thành công" }))
//             ]).then(() => dispatch({
//                 type: SAVE_SURVEY,
//                 payload: response.data
//             })).then( () => {
//                 history.goBack()
//             })
//         )
//     }
// }

export function saveSurvey(data, questions, dispatch) {
    return graphqlService.mutate(MUTATION_SAVE_SURVEY, { data, questions }, dispatch)
}
export function disableSurvey(_id, dispatch) {
    return graphqlService.mutate(MUTATION_DISABLE_SURVEY, { _id }, dispatch);
}
export function removeSurvey(_id, dispatch) {
    return graphqlService.mutate(MUTATION_REMOVE_SURVEY, { _id }, dispatch);
}
//các action liên quan đến thực thi khảo sát thay khách hàng
export function getUserInfo(phoneNumber, dispatch) {
    return graphqlService.query(QUERY_GET_USERINFO, { phoneNumber }, dispatch);
}
export function createUser(data) {
    return (dispatch) => {
        graphqlService.mutate(MUTATION_CREATE_USER, { data }, dispatch).then(response =>
            Promise.all([

            ]).then(() => dispatch({
                type: CREATE_USER,
                payload: response.data
            }))
        )
    }
}
export function submitSurveyResult(phone, full_name, data, dispatch) {
    return graphqlService.mutate(MUTATION_SUBMIT_SURVEY_RESULT, { phone, full_name, data }, dispatch)
}

//Thực hiện khảo sát của nhân viên
export function submitSurveyResultEmployee(data, dispatch) {
    return graphqlService.mutate(MUTATION_SUBMIT_SURVEY_RESULT_EMPLOYEE, { data }, dispatch)
}

export function getUserSurveyHistory(phone, dispatch) {
    return graphqlService.query(QUERY_USER_SURVEY_HISTORY, phone, dispatch)
}
export function getUserByPhone(phone, dispatch) {
    return graphqlService.query(QUERY_USER_BY_PHONE, phone, dispatch)
}
export function getUsersBySurvey(begin, end, page, pageSize, filtered, sorted, surveyIds, dispatch) {
    return graphqlService.query(QUERY_USERS_SEARCH_BY_SURVEY, { begin, end, page, pageSize, filtered, sorted, surveyIds }, dispatch)
}
export function getUserActionsSearchBySurvey(page, pageSize, filtered, sorted, phone, dispatch) {
    return graphqlService.query(QUERY_USER_ACTIONS_SEARCH_BY_SURVEY, { page, pageSize, filtered, sorted, phone }, dispatch)
}
export function getUserActions(page, pageSize, filtered, sorted, phone, dispatch) {
    return graphqlService.query(GET_USER_ACTONS, { page, pageSize, filtered, sorted, phone }, dispatch)
}
export function getSurveyFrequenceData(begin, end, surveyIds, rangNumb, dispatch) {
    return graphqlService.query(GET_SURVEY_FREQUENCE_DATA, { begin, end, surveyIds, rangNumb }, dispatch)
}
export function getQuestionsAnalysticData(quesids, begin, end, dispatch) {
    return graphqlService.query(GET_QUESTIONS_ANALYSTIC_DATA, { quesids, begin, end }, dispatch)
}

//trongpv - for survey dashboard
export function getSurveysGeneralReport(begin, end, surveyIds, dispatch) {
    return graphqlService.query(SURVEY_GENERAL_REPORT, { begin, end, surveyIds }, dispatch)
}
export function getUserInfoById(_id, dispatch) {
    return graphqlService.query(QUERY_GET_USERINFO_WITH_ID, { _id }, dispatch);
}
export function getSurveyResults(variables, dispatch) {
    return graphqlService.query(QUERY_GET_SURVEY_RESULTS, variables, dispatch);
}