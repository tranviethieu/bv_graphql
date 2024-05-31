import React from 'react';

export const CallsAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path     : '/apps/calls/in',
            component: React.lazy(() => import('./CallIn'))
        },
        {
            path     : '/apps/calls/out',
            component: React.lazy(() => import('./CallOut'))
        },
        {
            path: '/apps/calls/campaigns/edit/:_id',
            component: React.lazy(() => import('./CallCampaignEdit'))
        } ,
        {
            path: '/apps/calls/campaigns/edit',
            component: React.lazy(() => import('./CallCampaignEdit'))
        },
        {
            path     : '/apps/calls/campaigns',
            component: React.lazy(() => import('./CallCampaigns'))
        },
    ]
};
