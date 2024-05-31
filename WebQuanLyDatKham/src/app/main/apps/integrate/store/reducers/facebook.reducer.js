import * as Actions from '../actions';

const initialState = {
    mobileFacebookLoginSidebarOpen: false,
    facebookLoginSidebarOpen: false,
    facebookConnectSidebarOpen: false,
    facebookLogedInUser:null,
    integrateId: null,
    
};

const integrateFacebookReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.OPEN_MOBILE_FACEBOOK_LOGIN_SIDEBAR:
            {
                return {
                    ...state,
                    mobileFacebookLoginSidebarOpen: true
                }
            }
        case Actions.CLOSE_MOBILE_FACEBOOK_LOGIN_SIDEBAR:
            {
                return {
                    ...state,
                    mobileFacebookLoginSidebarOpen: false
                }
            }
        case Actions.OPEN_FACEBOOK_LOGIN_SIDEBAR:
            {
                return {
                    ...state,
                    facebookLoginSidebarOpen: true
                }
            }
        case Actions.CLOSE_FACEBOOK_LOGIN_SIDEBAR:
            {
                return {
                    ...state,
                    facebookLoginSidebarOpen: false
                }
            }
        case Actions.OPEN_FACEBOOK_CONNECT_SIDEBAR:
            {
                return {
                    ...state,
                    facebookConnectSidebarOpen: true
                }
            }
        case Actions.CLOSE_FACEBOOK_CONNECT_SIDEBAR:
            {
                return {
                    ...state,
                    facebookConnectSidebarOpen: false
                }
            }
        case Actions.SET_FACEBOOK_LOGEDIN_USER:
            {
                return {
                    ...state,
                    facebookLogedInUser: action.value,
                }
            }
        case Actions.SET_INTEGRATE_ID:
            {
                return{
                    ...state,
                    integrateId:action.value,
                }
            }

        default:
            {
                return state;
            }
    }
};

export default integrateFacebookReducer;