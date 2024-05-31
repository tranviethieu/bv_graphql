import React from 'react';

export const AssignmentConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path     : '/apps/assignment/workby',
            component: React.lazy(() => import('./JobsByMe'))
        },
        {
            path: '/apps/assignments/createfromcampaign/:campaignId',
            component: React.lazy(() => import('./CreateAssignmentFromCampaign'))
        },
        {
            path: '/apps/assignments/edit/:_id',
            component: React.lazy(() => import('./AssignmentEdit'))
        },
        {
            path: '/apps/assignments/edit',
            component: React.lazy(() => import('./AssignmentEdit'))
        },
        {
            path     : '/apps/assignments',
            component: React.lazy(() => import('./JobsAll'))
        },
        {
            path     : '/apps/assignment/workto',
            component: React.lazy(() => import('./JobsToMe'))
        },

    ]
};
