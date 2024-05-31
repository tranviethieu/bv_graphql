import { combineReducers } from 'redux';
// import React from 'react';
import * as Actions from '../../actions';
// import _ from '@lodash';
// const sampleDialogData = {
//     id: 'appointment',
//     children: <div style={{height:300}}>Hello</div>,
//     rootClass: "w-1/4",

// }

const dialogs = (state = [], action) => {
    switch (action.type) {
        case Actions.SHOW_QUICK_DIALOG: {
            //loc theo id
            if (!action.dialog||!action.dialog.id) {
                //bat buoc phai co id
                return state;
            }
            const filter = state.filter(item => item.id !== action.dialog.id);
            return [...filter, action.dialog];
        }
        case Actions.HIDE_QUICK_DIALOG: {
            const filter = state.filter(item => item.id !== action.data);
            return filter;
        }
        case Actions.HIDE_ALL_QUICK_DIALOG: {
          return [];
        }
        default: {
            return state;
        }
    }
}
export default combineReducers({ dialogs });
