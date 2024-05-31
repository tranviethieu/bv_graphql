import {combineReducers} from 'redux';
import fuse from './fuse';
import auth from 'app/auth/store/reducers';
import subscribe from './subscribe'
import calling from './calling';
import chatting from './chatting';
import quickdialog from './quickdialog';
const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        fuse,
        subscribe,
        calling,
        chatting,
        quickdialog,
        ...asyncReducers
    });

export default createReducer;
