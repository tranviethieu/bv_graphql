import React from 'react';

export const UserActionsManagerConfig = {
    settings: {
        layout: {}
    },
    routes: [
        // {
        //     path     : '/apps/appointments/:_id/:phoneNumber?',
        //     component: React.lazy(() => import('./appointment/EditAppointment'))
        // },
        {
            path     : '/apps/user-actions-manager',
            component: React.lazy(() => import('./UAsManager'))
        }          
    ]
};
