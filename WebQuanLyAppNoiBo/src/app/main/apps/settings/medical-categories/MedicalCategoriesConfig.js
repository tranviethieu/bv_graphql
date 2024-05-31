import React from 'react';
import {Redirect} from 'react-router-dom';

export const MedicalCategoriesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path: '/apps/medical-categories',
            component: React.lazy(() => import('./MedicalCategories'))

        }
    ]
};
