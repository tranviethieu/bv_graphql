import React from 'react';

export const SurveysAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/surveys',
            component: React.lazy(() => import('./Surveys'))
        },
        {
            path: '/apps/surveys/edit/:_id',
            component: React.lazy(() => import('./SurveyEdit'))
        },
        {
            path: '/apps/surveys/search',
            component: React.lazy(() => import('./Surveys'))
        }
    ]
};
