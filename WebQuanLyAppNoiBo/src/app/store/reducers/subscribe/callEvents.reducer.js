import * as Actions from '../../actions';

const initialData = {
    event: null,
    selectedCall: null,
    calls:[]
}

function callsReducer (state = initialData, action) {
    switch (action.type) {
        case Actions.SET_SELECTED_CALL: {
            return {
                ...state,
                selectedCall:action.data
            }
        }
        case Actions.SET_CALLEVENT_DATA: {
            // console.log("callevent data:",state.calls)
            const newCalls = state.calls.filter(item => item&&item.phoneNumber !== action.data.phoneNumber && item.direction !== action.data.direction);
            newCalls.unshift(action.data);
            return {
                ...state,
                event: action.data,
                calls:newCalls
            }
        }
        default: {
            return state;
        }
    }
}
export default callsReducer;
