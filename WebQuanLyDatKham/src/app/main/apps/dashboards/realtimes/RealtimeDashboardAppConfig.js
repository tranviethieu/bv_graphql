import React from 'react';

export const RealtimeDashboardAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/realtime',
            component: React.lazy(() => import('./RealtimeDashboardApp'))
        },
        {
            path     : '/apps/welcome',
            component: React.lazy(() => import('../welcome/welcome'))
        }
    ]
};
