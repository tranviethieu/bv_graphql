import React from 'react';
import {Redirect} from 'react-router-dom';

export const WardsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/wards',
            component: React.lazy(() => import('./Wards'))

        }
    ]
};
