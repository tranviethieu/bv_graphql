import React from 'react';
import {Redirect} from 'react-router-dom';

export const ArticlesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/articles',
            component: React.lazy(() => import('./Articles'))

        }
    ]
};
