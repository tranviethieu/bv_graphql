import React from 'react';
import {Redirect} from 'react-router-dom';

export const NationalityAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/nationality',
            component: React.lazy(() => import('./Nationals'))

        }
    ]
};
