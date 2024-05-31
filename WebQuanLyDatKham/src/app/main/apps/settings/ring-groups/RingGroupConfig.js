import React from 'react';

export const RingGroupsConfig = {
    settings: {
        layout: {}
    },
    routes: [

        {
            path: '/apps/ring-groups/:_id',
            component: React.lazy(() => import('./EditRingGroup'))
        } ,
        {
            path: '/apps/ring-groups',
            component: React.lazy(() => import('./RingGroups'))
        }   
    ]
};
