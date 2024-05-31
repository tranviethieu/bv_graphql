import React from 'react';
import {Redirect} from 'react-router-dom';

export const MedicalServicesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/medical-services',
            component: React.lazy(() => import('./MedicalServices'))

        }
    ]
};
