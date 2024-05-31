import React from 'react';

export const MenuConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/menu/group-graph/:groupId',
            component: React.lazy(() => import('./MenuGraphAccountGroup'))
        },
        {
            path: '/apps/menu/graph',
            component: React.lazy(() => import('./MenuGraph'))
        },
        
    ]
};
