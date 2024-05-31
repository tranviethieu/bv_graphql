import React from 'react';
import {Redirect} from 'react-router-dom';

export const IntegrateAppConfig = {
    settings: {
        layout: {}
    },
    routes  : [        
        {
            path     : '/apps/integrate/facebook',
            component: React.lazy(() => import("./facebook/Login"))
        },       
        {
            path     : '/apps/integrate',
            component: React.lazy(() => import("./IntegrateApp"))
        }
    ]
    
};
