import facebook from './facebook.reducer';
import integrates from './integrates.reducer';
import {combineReducers} from 'redux';

const reducer = combineReducers({
    facebook,
    integrates
});

export default reducer;
