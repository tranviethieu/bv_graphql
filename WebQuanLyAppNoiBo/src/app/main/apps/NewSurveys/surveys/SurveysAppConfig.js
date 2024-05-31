import React from 'react';

export const SurveysAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/surveys/edit/:_id',
            component: React.lazy(() => import('./SurveyEdit'))
        },
        {
            path: '/apps/survey/:_id',
            component: React.lazy(() => import('./Survey'))
        },
        {
            path: '/apps/surveys',
            component: React.lazy(() => import('./Surveys'))
        },
        {
            path: '/apps/user/history/:_id',
            component: React.lazy(() => import('./UserSurveyHistory'))
        },
        {
            path: '/apps/question/:id',
            component: React.lazy(() => import('./Question'))
        },
        {
            path: '/apps/reports/surveys',
            component: React.lazy(() => import('../dashboards/DashboardApp'))
        },
    ]
};
