import * as Actions from '../../actions'

const initialData = {
    phoneNumber: null,
    user:null
}

const callReducers = (state=initialData,action) => {
    switch (action.type) {
        case Actions.CLEAR_CALL: {
            return {
                initialData
            }
        }
        case Actions.SET_USER: {
            return {
                ...state,
                user:action.data
            }
        }
        case Actions.SET_PHONENUMBER: {
            return {
                ...state,
                phoneNumber:action.data
            }
        }
        default: {
            return state;
        }
    }
}
export default callReducers;