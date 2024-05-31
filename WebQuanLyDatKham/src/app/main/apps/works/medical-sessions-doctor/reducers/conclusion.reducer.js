import * as Actions from '../actions';

const initialData = {
    data: []
};

const conclusion = function (newData = initialData, action) {
    switch ( action.type )
    {
        case Actions.SET_CONCLUSION_STORE:
        {
          return {
            ...newData,
            data: action.payload
          }
        }
        case Actions.ADD_CONCLUSION_STORE:
        {
          return {
            ...newData,
            data: [...newData.data, action.payload]
          }
        }
        case Actions.REMOVE_CONCLUSION_STORE:
        {
          return {
            data: [
              ...newData.data.filter(item => item.code !== action.payload)
            ]
          }
        }
        case Actions.RESET_CONCLUSION_STORE:
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

export default conclusion;
