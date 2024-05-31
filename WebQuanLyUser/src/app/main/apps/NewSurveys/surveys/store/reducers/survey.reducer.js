import { combineReducers } from 'redux';
import * as Actions from '../actions/survey.action'

const initialData = {
    data: {
        _id         : null,
        name        : "test",
        title       : "test",
        questionIds : [],
        createdTime : null,
        updatedTime : null
    },
    questions: []
}

const SurveyReducer = (state = initialData, action) =>{
    switch(action.type) {
        case Actions.SAVE_SURVEY: {
            return {
                ...state,
                data: action.payload
            }
        }
        default: {
            return state;
        }
    }
}
export default combineReducers({ survey: SurveyReducer })