import React from 'react';

export const WelcomeAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/welcome',
            component: React.lazy(() => import('./welcome'))
        }
    ]
};
