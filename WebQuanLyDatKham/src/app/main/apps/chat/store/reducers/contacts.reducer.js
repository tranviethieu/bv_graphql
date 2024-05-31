import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
    entities: [],
    selectedContactId: null,
    //trongpv
    integratedApps : [],
    selectedIntegratedApp:null,
    selectedChannel: null,
    conversations: [],
    conversations_page: 0,
    conversations_pageSize: 20,
    conversations_filtered: [],
    conversations_sorted: [{id:"recent_message.createdTime", desc:true}],
    selectedConversation: null,
};

const contactsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_CONTACTS:
            {
                return {
                    ...state,
                    entities: [...action.payload]
                };
            }
        case Actions.SET_SELECTED_CONTACT_ID:
            {
                return {
                    ...state,
                    selectedContactId: action.payload
                };
            }
        case Actions.REMOVE_SELECTED_CONTACT_ID:
            {
                return {
                    ...state,
                    selectedContactId: null
                };
            }

        //trongpv
        case Actions.SET_INTEGRATED_APPS:
            {
                // console.log("SET_INTEGRATED_APPS: ", action.payload)
                return{
                    ...state,
                    integratedApps:action.payload
                }
            }
        case Actions.SET_SELECTED_INTEGREATED_APP:
            {
                return{
                    ...state,
                    selectedIntegratedApp: action.payload
                }
            }
        case Actions.GET_INTEGREATED_APP_CHANNEL:
            {
                return{
                    ...state,
                    selectedChannel: action.payload
                }
            }
        case Actions.SET_INTEGRATED_CONVERSATIONS:
            {
                return {
                    ...state,
                    conversations: [...action.payload]
                }
            }
        case Actions.SET_CONVERSATIONS_FILTERED:
            {
                return {
                    ...state,
                    conversations_filtered: action.payload
                }
            }
        case Actions.SET_CONVERSATIONS_SORTED:
            {
                return {
                    ...state,
                    conversations_sorted: action.payload
                }
            }
        case Actions.SET_SELECTED_CONVERSATION:
            {
                return {
                    ...state,
                    selectedConversation: action.payload
                }
            }
        case Actions.REMOVE_SELECTED_CONVERSATION:
            {
                return {
                    ...state,
                    selectedConversation: null
                }
            }
        case Actions.SET_CONVERSATIONS_PAGE:
            {
                return {
                    ...state,
                    conversations_page: action.payload,
                }
            }
        case Actions.MOVE_CONVERSATION_TO_FIRST:
            console.log("move payload: ", action.payload)
            var sortedItems = _.sortBy([...state.conversations], function (item) {
                return item._id === action.payload ? 0 : 1;
            });
            return {
                ...state,
                conversations: sortedItems
            }

        default:
            {
                return state;
            }
    }
};

export default contactsReducer;