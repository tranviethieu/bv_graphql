import appointments from './appointments.reducer';
import {combineReducers} from 'redux';


const reducer = combineReducers({
    appointments
});

export default reducer;