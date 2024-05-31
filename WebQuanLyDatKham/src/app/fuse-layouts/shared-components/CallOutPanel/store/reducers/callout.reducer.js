import * as Actions from '../actions';

const initialState = {
    state: false,
    phoneNumber : null
};

const callout = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.TOGGLE_CALL_PANEL:
        {
            return {
                ...state,
                state: !state.state,
                phoneNumber: action.phoneNumber
            };
        }
        default:
        {
            return state;
        }
    }
};

export default callout;
