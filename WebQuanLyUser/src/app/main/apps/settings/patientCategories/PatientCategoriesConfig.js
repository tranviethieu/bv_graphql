import React from 'react';
import {Redirect} from 'react-router-dom';

export const PatientCategoriesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/patient-categories',
            component: React.lazy(() => import('./PatientCategories'))

        }
    ]
};
