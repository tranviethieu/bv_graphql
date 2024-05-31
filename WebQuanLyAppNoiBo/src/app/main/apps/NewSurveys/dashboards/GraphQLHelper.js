
import graphqlService from "app/services/graphqlService";
import { QUERY_USERACTIONS, } from "./query";
import {SURVEY_GENERAL_REPORT} from './query'

export function getUserActions(params, dispatch) {
    return graphqlService.query(QUERY_USERACTIONS, params, dispatch);
}

//trongpv - for survey dashboard
export function getSurveysGeneralReport(begin, end, surveyIds, dispatch) {
    return graphqlService.query(SURVEY_GENERAL_REPORT,{begin, end, surveyIds}, dispatch)
}
