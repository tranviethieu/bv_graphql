import React from 'react';

export const SurveyReportConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path     : '/apps/reports/surveys/:_id',
            component: React.lazy(() => import('./Survey'))
        } ,
        {
            path     : '/apps/reports/surveys',
            component: React.lazy(() => import('./ReportSurveys'))
        },
        {
            path     : '/apps/user/history/:phone',
            component: React.lazy(() => import('./UserSurveyHistory'))
        },
    ]
};
