import React from 'react';

export const CallsEventConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/calls-event',
            component: React.lazy(() => import('./CallsEvent'))
        }
    ]
};
