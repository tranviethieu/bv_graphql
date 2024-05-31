import graphqlService from 'app/services/graphqlService';
import { showMessage } from 'app/store/actions'

import history from '@history';

import {
  QUERY_SURVEY_GENERALREPORT,
QUERY_GET_SURVEY,
QUERY_USER_SURVEY_HISTORY,
QUERY_USER_BY_PHONE,
QUERY_USERS_SEARCH_BY_SURVEY,
QUERY_USER_ACTIONS_SEARCH_BY_SURVEY,
GET_USER_ACTONS,
GET_SURVEY_FREQUENCE_DATA,
GET_QUESTIONS_ANALYSTIC_DATA,
} from './query'

export const GET_SURVEY = '[SURVEY APP] GET SURVEY';
export const SAVE_SURVEY = '[SURVEY APP] SAVE SURVEY';
export const REMOVE_SURVEY = '[SURVEY APP] REMOVE SURVEY';
//các action liên quan đến thực thi survey thay khách hàng
export const CREATE_USER = '[SURVEY APP] CREATE USER';
export const GET_USERINFO = '[SURVEY APP] GET USERINFO';
export const SUBMIT_SURVEY_RESULT = '[SURVEY APP] SUBMIT SURVEY RESULT';

export function getSurvey(_id, dispatch) {
return graphqlService.query(QUERY_GET_SURVEY, { _id }, dispatch);
}

export function getUserSurveyHistory(phone, dispatch)
{
return graphqlService.query(QUERY_USER_SURVEY_HISTORY,phone, dispatch)
}
export function getUserByPhone(phone, dispatch)
{
return graphqlService.query(QUERY_USER_BY_PHONE,phone, dispatch)
}
export function getUsersBySurvey(begin, end ,page, pageSize, filtered, sorted, surveyIds,actionNumFiltered, dispatch){
return graphqlService.query(QUERY_USERS_SEARCH_BY_SURVEY,{begin, end ,page, pageSize, filtered, sorted, surveyIds, actionNumFiltered},dispatch)
}
export function getUserActionsSearchBySurvey(page, pageSize, filtered, sorted, phone,dispatch){
return graphqlService.query(QUERY_USER_ACTIONS_SEARCH_BY_SURVEY,{page, pageSize, filtered, sorted, phone}, dispatch)
}
export function getUserActions(page, pageSize, filtered, sorted, phone,dispatch)
{
return graphqlService.query(GET_USER_ACTONS,{page, pageSize, filtered, sorted, phone}, dispatch)
}
export function getSurveyFrequenceData(begin, end, surveyIds, rangNumb, dispatch )
{
return graphqlService.query(GET_SURVEY_FREQUENCE_DATA, {begin, end, surveyIds, rangNumb}, dispatch)
}
export function getQuestionsAnalysticData(quesids,begin, end, dispatch){
return graphqlService.query(GET_QUESTIONS_ANALYSTIC_DATA,{quesids, begin, end}, dispatch)
}
export function getSurveysGeneralReport(begin, end, surveyIds, dispatch) {
    return graphqlService.query(QUERY_SURVEY_GENERALREPORT,{begin, end, surveyIds}, dispatch)
}
