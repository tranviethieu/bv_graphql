import React from 'react';

export const JobReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [       
        {
            path     : '/apps/reports/general-jobs',
            component: React.lazy(() => import('./JobReportGeneral'))
        },
        {
            path     : '/apps/reports/self-jobs',
            component: React.lazy(() => import('./JobReportSelf'))
        },
    ]
};
