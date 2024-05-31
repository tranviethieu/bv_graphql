import axios from 'axios';

export const GET_CONTACTS = '[CHAT APP] GET CONTACTS';
export const SET_SELECTED_CONTACT_ID = '[CHAT APP] SET SELECTED CONTACT ID';
export const REMOVE_SELECTED_CONTACT_ID = '[CHAT APP] REMOVE SELECTED CONTACT ID';

export const SET_INTEGRATED_APPS = '[CHAT APP] SET INTEGREATED APPS'
export const SET_SELECTED_INTEGREATED_APP = '[CHAT APP] SET SELECTED INTEGREATED APP'
export const GET_INTEGREATED_APP_CHANNEL = '[CHAT APP] GET INTEGREATED APP CHANNEL'
export const SET_INTEGRATED_CONVERSATIONS = '[CHAT APP] GET INTEGRATED CONVERSATIONS'
export const SET_CONVERSATIONS_FILTERED = '[CHAT APP] GET CONVERSATIONS FILLTERED'
export const SET_CONVERSATIONS_SORTED = '[CHAT APP] GET CONVERSATIONS SORTED'
export const SET_SELECTED_CONVERSATION = '[CHAT APP] SET SELECTED CONVERSATIONS'
export const REMOVE_SELECTED_CONVERSATION = '[CHAT APP] REMOVE SELECTED CONVERSATION'
export const SET_CONVERSATIONS_PAGE = '[CHAT APP] SET CONVERSATION PAGE'
export const MOVE_CONVERSATION_TO_FIRST = '[CHAT APP] MOVE CONVERSATION TO FIRST' //khi admin gửi tin nhắn thì chuyển cuộc hội thoại lên đầu danh sách

export function getContacts()
{
    const request = axios.get('/api/chat/contacts');
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type   : GET_CONTACTS,
                payload: response.data
            })
        );
}

export function setselectedContactId(contactId)
{
    return {
        type   : SET_SELECTED_CONTACT_ID,
        payload: contactId
    }
}
export function setSelectedChatChannel(channel)
{
    return{
        type: GET_INTEGREATED_APP_CHANNEL,
        payload: channel
    }
}

export function removeSelectedContactId()
{
    return {
        type: REMOVE_SELECTED_CONTACT_ID
    }
}

export function setIntegratedConversations(users){
    return{
        type: SET_INTEGRATED_CONVERSATIONS,
        payload: users
    }
}

export function setConversationFiltered(filtered){
    return{
        type: SET_CONVERSATIONS_FILTERED,
        payload: filtered
    }
}
export function setConversationSorted(sorted){
    return{
        type: SET_CONVERSATIONS_SORTED,
        payload: sorted
    }
}
export function setSelectedConversation(conversation){
    return{
        type: SET_SELECTED_CONVERSATION,
        payload: conversation
    }
}
export function removeSelectedConversation(){
    return{
        type: REMOVE_SELECTED_CONVERSATION
    }
}
export function setConversationsPage(page){
    return{
        type: SET_CONVERSATIONS_PAGE,
        payload: page,
    }
}
export function moveConversationToFirst(_id){
    return{
        type:MOVE_CONVERSATION_TO_FIRST,
        payload:_id
    }
}
export function setIntegratedApps(apps){
    return {
        type:SET_INTEGRATED_APPS,
        payload: apps
    }
}
export function setSelectedIntegratedApp(app){
    return{
        type:SET_SELECTED_INTEGREATED_APP,
        payload: app
    }
}