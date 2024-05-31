import React from 'react';
import {Redirect} from 'react-router-dom';

export const CustomerAppConfig = {
    settings: {
        layout: {}
    },
    routes  : [
        {
            path     : '/apps/users/:id',
            component: React.lazy(() => import('./CustomerAppUser'))
        },
        {
            path     : '/apps/users',
            component: React.lazy(() => import("./CustomerApp"))
        }
    ]
    
};
