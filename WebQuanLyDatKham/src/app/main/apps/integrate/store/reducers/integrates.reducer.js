import * as Actions from '../actions';


const initialData = {
    drawer:{
        open: false,
        data:null
    },
    data:[]
}

const integratesReducer = (state = initialData, action) => {
    switch (action.type) {    
        case Actions.GET_INTEGRATES: {
            return {
                ...state,
                data:action.payload
            }
        }
        case Actions.DISABLE_INTEGRATED_ACCOUNT: {
            return {
                ...state,
                drawer: {
                    ...state.drawer,
                    data:action.data
                }
            }
        }
        case Actions.SHOW_DRAWER: {
            console.log("getAction:", action);
            return {
                ...state,
                drawer: {
                    data:action.payload,
                    open:true
                }
            }
        }
        case Actions.HIDE_DRAWER: {
            return {
                ...state,
                drawer: initialData
            }
        }
        default: {
            return state;
        }

    }
}

export default integratesReducer;