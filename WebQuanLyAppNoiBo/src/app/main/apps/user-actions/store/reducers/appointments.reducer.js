import * as Actions from '../actions';
const initialData = {
    data:[]
}


const appointmentsReducer = (state = initialData, action) => {
    switch (action.type) {

        case Actions.GET_APPOINTMENTS: {
            
            return {
                ...state,
                data:action.payload
            }
        }
        default:{
            return state;
        }
    }
}
export default appointmentsReducer;