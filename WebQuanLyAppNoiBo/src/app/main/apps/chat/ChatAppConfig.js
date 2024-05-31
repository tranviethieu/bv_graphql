import React from 'react';

export const ChatAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/chat/:conversationId?/:jobId?',
            component: React.lazy(() => import('./ChatApp'))
        }
    ]
};
