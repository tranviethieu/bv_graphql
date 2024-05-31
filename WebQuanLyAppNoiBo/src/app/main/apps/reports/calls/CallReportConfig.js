import React from 'react';

export const CallReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [       
        {
            path     : '/apps/reports/calls/ringgroup',
            component: React.lazy(() => import('./ReportCallRingGroup'))
        },
        {
            path     : '/apps/reports/calls/in',
            component: React.lazy(() => import('./ReportCallIn'))
        },
        {
            path     : '/apps/reports/calls/out',
            component: React.lazy(() => import('./ReportCallOut'))
        },
    ]
};
