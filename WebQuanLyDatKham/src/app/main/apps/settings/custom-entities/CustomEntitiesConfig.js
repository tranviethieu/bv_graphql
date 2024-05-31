import React from 'react';

export const CustomEntitiesConfig = {
    settings: {
        layout: {}
    },
    routes: [
        
        {
            path: '/apps/config/custom-entities/:className?',
            component: React.lazy(() => import('./CustomEntites'))
        }
        
    ]
};
