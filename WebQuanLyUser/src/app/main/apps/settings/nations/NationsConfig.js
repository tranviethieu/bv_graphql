import React from 'react';
import {Redirect} from 'react-router-dom';

export const NationsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/nations',
            component: React.lazy(() => import('./Nations'))

        }
    ]
};
