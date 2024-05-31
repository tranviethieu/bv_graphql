import React from 'react';

export const NotifyAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/notifies',
            component: React.lazy(() => import('./Notifies'))
        },
        {
            path: '/apps/notify/queue',
            component: React.lazy(() => import('./dashboard/NotifyQueue'))
        },
        {
            path: '/apps/notify/send',
            component: React.lazy(() => import('./dashboard/NotifySend'))
        },
    ]
};
