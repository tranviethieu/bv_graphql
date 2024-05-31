import React from 'react';
import {Redirect} from 'react-router-dom';

export const AccountsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [       
        {
            path: '/apps/accounts',
            component: React.lazy(() => import('./Accounts'))
            
        }
    ]
};
