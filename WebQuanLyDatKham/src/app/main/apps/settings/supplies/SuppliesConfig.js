import React from 'react';
import {Redirect} from 'react-router-dom';

export const SuppliesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/supplies',
            component: React.lazy(() => import('./Supplies'))

        }
    ]
};
