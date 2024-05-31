import React from 'react';
import { Redirect } from 'react-router-dom';

export const DoctorAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/doctors',
            component: React.lazy(() => import('./Doctors'))

        }
    ]
};
