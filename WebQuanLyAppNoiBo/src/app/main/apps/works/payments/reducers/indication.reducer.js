import * as Actions from '../actions';

const initialData = {
    data: [],
    dataServer: []
};

const indication = function (newData = initialData, action) {
    switch ( action.type )
    {
        case Actions.GET_INDICATION_STORE:
        {
            return {
                ...newData,
                data: action.payload
            };
        }
        case Actions.SET_INDICATION_STORE:
        {
          return {
            ...newData,
            data: action.payload
          }
        }
        case Actions.ADD_INDICATION_STORE:
        {
          return {
            ...newData,
            data: [...newData.data, action.payload]
          }
        }
        case Actions.ADD_INDICATION_UPDATE_SERVER:
        {
          return {
            ...newData,
            dataServer: [...newData.dataServer, action.payload]
          }
        }
        case Actions.REMOVE_INDICATION_STORE:
        {
          return {
            data: [
              ...newData.data.filter(item => item !== action.payload)
            ]
          }
        }
        default:
        {
            return newData;
        }
    }
};

export default indication;
