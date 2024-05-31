import * as Actions from '../actions';
import { combineReducers } from 'redux';
const initialState = {
    data: [],
    pages: 1,
    records:0,
    selectedCall: null,
    clickItem:null
};

const callsReducer = (state = initialState, action) => {

    switch (action.type) {
        case Actions.SET_CLICK_ITEM: {
            return {
                ...state,
                clickItem:action.data
            }
        }
        case Actions.GET_CALLS: {

            return {
                ...state,                                
                data: [...state.data, ...action.payload.data],
                page: action.payload.page,
                pages:action.payload.pages
            }
        }
        case Actions.SELECT_CALL: {
            return {
                ...state,
                selectedCall: action.data
            }
        }
        default: {
            return state;
        }
    }
}

const reducers = combineReducers({
    calls: callsReducer
})
export default reducers;