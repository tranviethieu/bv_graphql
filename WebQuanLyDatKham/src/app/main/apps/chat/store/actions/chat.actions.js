import axios from 'axios';
import {setselectedContactId} from './contacts.actions';
import {closeMobileChatsSidebar} from './sidebars.actions';

export const GET_CHAT = '[CHAT APP] GET CHAT';
export const REMOVE_CHAT = '[CHAT APP] REMOVE CHAT';
export const SEND_MESSAGE = '[CHAT APP] SEND MESSAGE';

export const SEND_OPEN_CHANNEL_MESSAGE = '[CHAT APP] SEND OPEN CHANNEL MESSAGE'
export const GET_INTEGRATED_MESSAGES = '[CHAT APP] GET INTEGRATED MESSAGES'

export const SET_CHAT_PAGE = '[CHAT APP] SET CHAT PAGE'
export const SET_CONVERSATION_MESSAGES = '[CHAT APP] SET CONVERSATION MESSAGES'

export function getChat(contactId)
{
    return (dispatch, getState) => {
        const {id: userId} = getState().chatPanel.user;
        const request = axios.get('/api/chat/get-chat', {
            params: {
                contactId,
                userId
            }
        });

        return request.then((response) => {
            console.log("get chat response: ", response)
            dispatch(setselectedContactId(contactId));

            dispatch(closeMobileChatsSidebar());

            return dispatch({
                type        : GET_CHAT,
                chat        : response.data.chat,
                userChatData: response.data.userChatData
            });
        });
    }
}

export function removeChat()
{
    return {
        type: REMOVE_CHAT
    };
}

export function sendMessage(messageText, chatId, userId)
{
    const message = {
        'who'    : userId,
        'message': messageText,
        'time'   : new Date()
    };

    const request = axios.post('/api/chat/send-message', {
        chatId,
        message
    });

    return (dispatch) =>
        request.then((response) => {
                return dispatch({
                    type        : SEND_MESSAGE,
                    message     : response.data.message,
                    userChatData: response.data.userChatData
                })
            }
        );
}

export function sendOpenChannelMessage(value)
{
    return {
        type: SEND_OPEN_CHANNEL_MESSAGE,
        value
    }
}


//trongpv
export function setIntegratedMessages(page, pageSize, integratedId){
    
}

export function setChatPage(page){
    return{
        type: SET_CHAT_PAGE,
        payload: page
    }
}
export function setConversationMessages(messages){
    return{
        type: SET_CONVERSATION_MESSAGES,
        payload: messages
    }
}