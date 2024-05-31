import * as Actions from '../actions';

const initialState = {
    //trongpv
    chat_page:0,
    chat_pageSize: 20,
    chat_messages: [],
};

const chat = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_CHAT:
            {
                return {
                    ...action.chat
                };
            }
        case Actions.REMOVE_CHAT:
            {
                return null;
            }
        case Actions.SEND_MESSAGE:
            {
                return {
                    ...state,
                    dialog: [
                        ...state.dialog,
                        action.message
                    ]
                };
            }

        case Actions.SET_CHAT_PAGE:
            {
                return{
                    ...state,
                    chat_page: action.payload
                }
            }
            case Actions.SET_CONVERSATION_MESSAGES:
                {
                    return{
                        ...state,
                        chat_messages: action.payload
                    }
                }

        default:
            {
                return state;
            }
    }
};

export default chat;