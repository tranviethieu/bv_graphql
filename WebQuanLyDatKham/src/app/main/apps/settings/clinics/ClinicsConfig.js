import React from 'react';
import {Redirect} from 'react-router-dom';

export const ClinicsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/clinics',
            component: React.lazy(() => import('./Clinics'))

        }
    ]
};
