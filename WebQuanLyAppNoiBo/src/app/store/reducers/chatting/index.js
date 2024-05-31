import * as Actions from '../../actions'
const initialData = {
    chattingContact: null,
}

const chatReducers = (state=initialData,action) => {
    switch (action.type) {
        case Actions.SET_CHATTING_CONTACTS: {
            console.log("chatting recive chat: ", action.data)
        // "channel_id": "584738194914705",
        // "uid": "2547607468659336",
        // "type": "FACEBOOK_CHAT"
            // state.chattingContact.push(action.data)
            return {
                ...state,
                chattingContact:action.data
            }
        }
        default: {
            return state;
        }
    }
}
export default chatReducers;