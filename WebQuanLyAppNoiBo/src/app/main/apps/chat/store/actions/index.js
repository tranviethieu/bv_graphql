import graphqlService from 'app/services/graphqlService';
import { showMessage } from 'app/store/actions'

import {
    MUTATION_SEND_OPEN_CHANNEL_MESSAGE, QUERY_GET_INTEGRATED_CONVERSATIONS, QUERY_GET_CONVERSATION_MESSAGES, QUERY_GET_INTEGRATE_CHAT_APPS,
    QUERY_GET_INTEGRATED_USER, MUTATION_UPDATE_INTEGRATED_USER_PHONE_NUMBER,
    GET_ASSIGNABLE_ACCOUNT,MUTATION_CREATE_ASSIGN_JOB, QUERY_JOB_ASSIGNMENT, MUTATION_UPDATE_STATE_JOB
} from './query';

import { setIntegratedConversations,setSelectedConversation, setConversationsPage, setConversationFiltered, setConversationSorted, setSelectedIntegratedApp, setIntegratedApps, setSelectedChatChannel } from './contacts.actions'
import { setChatPage, setConversationMessages } from './chat.actions'

export * from './sidebars.actions';
export * from './contacts.actions';
export * from './user.actions';
export * from './chat.actions';

export function create_assign_job(variables, dispatch) {
    return graphqlService.mutate(MUTATION_CREATE_ASSIGN_JOB, variables, dispatch);
}

export function get_assignable_account(dispatch) {
    return graphqlService.query(GET_ASSIGNABLE_ACCOUNT, {}, dispatch);
}

export function sendOpenChannelMessage(data, dispatch) {
    return graphqlService.mutate(MUTATION_SEND_OPEN_CHANNEL_MESSAGE, { data }, dispatch);
}

export function getIntegratedConversations(page, pageSize, filtered, sorted, dispatch) {
    return graphqlService.query(QUERY_GET_INTEGRATED_CONVERSATIONS, { page, pageSize, filtered, sorted }, dispatch)
}

export function getConversationMessages(page, pageSize, integratedId, dispatch) {
    return graphqlService.query(QUERY_GET_CONVERSATION_MESSAGES, { page, pageSize, integratedId }, dispatch)
}
export function getIntegrateChatApps(dispatch) {
    return graphqlService.query(QUERY_GET_INTEGRATE_CHAT_APPS, {}, dispatch)
}
export function getIntegratedUser(uid, type){
    return graphqlService.query(QUERY_GET_INTEGRATED_USER,{uid, type})
}
export function updateIntegratedUserPhoneNumber(_id, phoneNumber){
    return graphqlService.mutate(MUTATION_UPDATE_INTEGRATED_USER_PHONE_NUMBER,{_id, phoneNumber})
}

export function resetBeforGetNewIntegratedApps(dispatch) {
    //Load lại list app thì phải reset mọi thứ theo thứ tự cấp: chat-messages ===> conversations ===> app

    return (dispatch) => {
        //for chat messages
        dispatch(setChatPage(0))
        dispatch(setConversationMessages([]))

        //for conversations
        dispatch( setSelectedConversation(null) )
        dispatch( setConversationsPage(0) )
        dispatch( setConversationFiltered([]) )
        // dispatch(  setConversationSorted([]) )
        dispatch(setIntegratedConversations([]))

        //for app
        dispatch( setSelectedIntegratedApp(null) )
        dispatch(  setIntegratedApps([]) )
    }

}
export function resetBeforGetNewConversations(dispatch) {
    // //Load lại list conversation thì phải reset mọi thứ theo thứ tự cấp: chat-messages ===> conversations
    //     //for chat messages
        dispatch(setChatPage(0))
        dispatch(setConversationMessages([]))

        // //for conversations
        dispatch(setSelectedConversation(null))
        dispatch(setConversationsPage(0))
        dispatch(setConversationFiltered([]))
        // dispatch(setConversationSorted([]))
        dispatch(setIntegratedConversations([]))

}
export function resetBeforSetNewConversationsFiltered(dispatch){
    //     //for chat messages
    dispatch(setChatPage(0))
    dispatch(setConversationMessages([]))
    //for chat channel
    // dispatch(setSelectedChatChannel(null))

    // //for conversations
    dispatch(setSelectedConversation(null))
    dispatch(setConversationsPage(0))
    // dispatch(setConversationFiltered([]))
    // dispatch(setConversationSorted([]))
    dispatch(setIntegratedConversations([]))
}
//function lấy thông tin 1 job
export function get_job_assignment(_id, dispatch){
  return graphqlService.query(QUERY_JOB_ASSIGNMENT, {_id}, dispatch)
}
//Cập nhật trạng thái công việc
export function updataStateJob(_id, state, dispatch){
  return graphqlService.mutate(MUTATION_UPDATE_STATE_JOB, { _id, state }, dispatch);
}
