import * as Actions from '../actions';

const initialData = {
    data: []
};

const prescription = function (newData = initialData, action) {
    switch ( action.type )
    {
        case Actions.SET_PRESCRIPTION_STORE:
        {
          return {
            ...newData,
            data: action.payload
          }
        }
        case Actions.ADD_PRESCRIPTION_STORE:
        {
          return {
            ...newData,
            data: [...newData.data, action.payload]
          }
        }
        case Actions.REMOVE_PRESCRIPTION_STORE:
        {
          return {
            data: [
              ...newData.data.filter(item => item._id !== action.payload)
            ]
          }
        }
        case Actions.RESET_PRESCRIPTION_STORE:
        {
          return {
            ...newData, initialData
          }
        }
        default:
        {
            return newData;
        }
    }
};

export default prescription;
