import React from 'react';
import {Redirect} from 'react-router-dom';

export const AccountGroupConfig = {
    settings: {
        layout: {}
    },
    routes: [ 
        {
            path     : '/apps/account-group/edit/:_id?',
            component: React.lazy(() => import("./AccountGroupEdit"))
        },
        {
            path     : '/apps/account-group',
            component: React.lazy(() => import("./AccountGroup"))
        }
    ]
    
};
