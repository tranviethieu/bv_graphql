import {combineReducers} from 'redux';

import callEvents from './callEvents.reducer';
const subscribeReducer = combineReducers({
    callEvents
});
export default subscribeReducer;