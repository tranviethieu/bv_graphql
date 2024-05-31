import * as Actions from '../actions';

const initialState = {
    // role: [],//guest
    data: {
        'displayName': 'Default',
        'photoURL'   : 'assets/images/avatars/profile.jpg',
        'email'      : 'default@default.com',
        shortcuts    : []
    }
};

const user = function (state = initialState, action) {
    switch ( action.type )
    {        
        case Actions.SET_USER_DATA:
        {
            return {
                ...initialState,
                data: {
                    ...action.payload,
                    // shortcuts: [
                    //     '5e7b2f86f5b6fa522f3a7def',
                    //     'calls-event',
                    //     'chat', 
                    //     'create-appointment',
                    //     'create-examination',
                    //     'create-testresult',
                    //     'create-scanresult',
                    //     'create-prescription',
                    //     'create-ticket',
                    // ]
                }
            };
        }
        case Actions.REMOVE_USER_DATA:
        {
            return {
                ...initialState
            };
        }
        case Actions.USER_LOGGED_OUT:
        {
            return initialState;
        }
        default:
        {
            return state
        }
    }
};

export default user;
