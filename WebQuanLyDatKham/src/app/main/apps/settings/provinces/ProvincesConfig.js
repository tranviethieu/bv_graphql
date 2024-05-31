import React from 'react';
import {Redirect} from 'react-router-dom';

export const ProvincesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/provinces',
            component: React.lazy(() => import('./Provinces'))

        }
    ]
};
