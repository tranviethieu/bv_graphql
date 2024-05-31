import React from 'react';
import {Redirect} from 'react-router-dom';

export const DistrictsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/districts',
            component: React.lazy(() => import('./Districts'))

        }
    ]
};
