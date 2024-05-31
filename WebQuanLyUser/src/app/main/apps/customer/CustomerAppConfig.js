import React from 'react';
import {Redirect} from 'react-router-dom';

export const CustomerAppConfig = {
    settings: {
        layout: {}
    },
    routes  : [          
        {
            path     : '/apps/users',
            component: React.lazy(() => import("./CustomerApp"))
        }
    ]
    
};
