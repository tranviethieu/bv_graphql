import * as Actions from '../../actions/currentCallPanel'

const initialData = {
    display: false,
    a: "ssss"
}

const currentCallReducers = (state=initialData,action) => {
    switch (action.type) {
        case Actions.TOGGLE_CURRENT_CALL_PANEL: {
          return {
              ...state,
              display: action.data
          }
        }
        default: {
            return state;
        }
    }
}
export default currentCallReducers;
