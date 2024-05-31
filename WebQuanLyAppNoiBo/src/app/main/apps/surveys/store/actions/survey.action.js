import graphqlService from 'app/services/graphqlService';
import { showMessage } from 'app/store/actions'
import { MUTATION_REMOVE_SURVEY, MUTATION_SAVE_SURVEY, QUERY_GET_SURVEY, QUERY_GET_SURVEYS, QUERY_GET_USERINFO, MUTATION_CREATE_USER, MUTATION_SUBMIT_SURVEY_RESULT } from './query'

export const GET_SURVEY = '[SURVEY APP] GET SURVEY';
export const GET_SURVEYS = '[SURVEY APP] GET SURVEYS';
export const SAVE_SURVEY = '[SURVEY APP] SAVE SURVEY';
export const REMOVE_SURVEY = '[SURVEY APP] REMOVE SURVEY';
//các action liên quan đến thực thi survey thay khách hàng
export const CREATE_USER= '[SURVEY APP] CREATE USER';
export const GET_USERINFO = '[SURVEY APP] GET USERINFO';
export const SUBMIT_SURVEY_RESULT = '[SURVEY APP] SUBMIT SURVEY RESULT';

export function getSurveys(variables, dispatch){
    return graphqlService.query(QUERY_GET_SURVEYS, variables, dispatch);
}
export function getSurvey(_id, dispatch){
    return graphqlService.query(QUERY_GET_SURVEY, { _id }, dispatch);
}
export function saveSurvey(data, questions, dispatch){
  return graphqlService.mutate(MUTATION_SAVE_SURVEY, { data,questions }, dispatch)
    // return (dispatch) =>{
    //     graphqlService.mutate(MUTATION_SAVE_SURVEY, { data,questions }, dispatch).then(response =>
    //         Promise.all([
    //             dispatch(showMessage({ message: "Lưu thông tin khảo sát thành công" }))
    //         ]).then(() => dispatch({
    //             type: SAVE_SURVEY,
    //             payload: response.data
    //         }))
    //     )
    // }
}
export function removeSurvey(_id, dispatch){
    return graphqlService.mutate(MUTATION_REMOVE_SURVEY, { _id }, dispatch);
}
//các action liên quan đến thực thi khảo sát thay khách hàng
export function getUserInfo(phoneNumber, dispatch){
    return graphqlService.query(QUERY_GET_USERINFO, { phoneNumber }, dispatch);
}
export function createUser(data, dispatch){
    return graphqlService.mutate(MUTATION_CREATE_USER, { data }, dispatch)
}
export function submitSurveyResult(userId, data, dispatch){
  return graphqlService.mutate(MUTATION_SUBMIT_SURVEY_RESULT, {userId, data}, dispatch)
    // return (dispatch) =>{
    //     graphqlService.mutate(MUTATION_SUBMIT_SURVEY_RESULT, {userId, data}, dispatch).then(response=>
    //         Promise.all([
    //             dispatch(showMessage({ message: "Thực hiện khảo sát thành công" }))
    //         ]).then(()=>dispatch({
    //             type: SUBMIT_SURVEY_RESULT,
    //             payload: response.data
    //         }))
    //     )
    // }
}
