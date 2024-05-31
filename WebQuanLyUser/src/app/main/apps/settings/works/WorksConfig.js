import React from 'react';
import {Redirect} from 'react-router-dom';

export const WorksConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/works',
            component: React.lazy(() => import('./Works'))

        }
    ]
};
